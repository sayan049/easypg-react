const { Server } = require("socket.io");

class SocketManager {
  constructor() {
    this.io = null;
    this.ownerSockets = new Map();
    this.studentSockets = new Map();
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "https://messmate-client.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 120000
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true // Add this for Socket.IO v2/v3 compatibility
    });

    // Enhanced authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          console.log('No token provided');
          return next(new Error("Authentication error"));
        }
        
        // Verify JWT token here (example using jsonwebtoken)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (err) {
        console.error('Socket auth error:', err);
        next(new Error("Authentication failed"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id, socket.user?._id);
      socket.emit("connection-status", { 
        status: "connected", 
        socketId: socket.id,
        userId: socket.user?._id
      });

      // Handle owner connections with acknowledgement
      socket.on("owner-join", ({ userId }, ack) => {
        console.log('Received owner-join for:', userId);
        if (!userId) {
          if (ack) ack({ status: 'error', message: 'Missing userId' });
          return;
        }
        
        if (!this.ownerSockets.has(userId)) {
          this.ownerSockets.set(userId, new Set());
        }
        this.ownerSockets.get(userId).add(socket.id);
        socket.join(`owner-${userId}`);
        console.log(`Owner ${userId} joined with socket ${socket.id}`);
        
        if (ack) ack({ status: 'success', rooms: [...socket.rooms] });
      });

      // Enhanced disconnection handling
      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected (${reason}):`, socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });

      // Enhanced error handling
      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      // Heartbeat mechanism with timeout
      socket.on("ping", (cb) => {
        if (typeof cb === "function") {
          setTimeout(() => cb("pong"), 1000);
        }
      });
    });

    return this.io;
  }
  _cleanUpDisconnectedSocket(socketId) {
    // Clean up owner connections
    for (const [ownerId, socketSet] of this.ownerSockets.entries()) {
      if (socketSet.has(socketId)) {
        socketSet.delete(socketId);
        console.log(`Owner ${ownerId} disconnected from socket ${socketId}`);
        if (socketSet.size === 0) {
          this.ownerSockets.delete(ownerId);
        }
      }
    }

    // Clean up student connections
    for (const [studentId, socketSet] of this.studentSockets.entries()) {
      if (socketSet.has(socketId)) {
        socketSet.delete(socketId);
        console.log(`Student ${studentId} disconnected from socket ${socketId}`);
        if (socketSet.size === 0) {
          this.studentSockets.delete(studentId);
        }
      }
    }
  }

  notifyOwnerNewBooking(ownerId, bookingData) {
    if (this.io && this.ownerSockets.has(ownerId)) {
      this.io.to(`owner-${ownerId}`).emit("new-booking", bookingData);
      console.log(`Notified owner ${ownerId} of new booking`);
      return true;
    }
    console.warn(`Owner ${ownerId} not connected for new booking notification`);
    return false;
  }

  notifyOwnerBookingUpdate(ownerId, bookingData) {
    if (this.io && this.ownerSockets.has(ownerId)) {
      this.io.to(`owner-${ownerId}`).emit("booking-updated", bookingData);
      console.log(`Notified owner ${ownerId} of booking update`);
      return true;
    }
    console.warn(`Owner ${ownerId} not connected for booking update notification`);
    return false;
  }

  // Student notification methods (kept for completeness)
  notifyStudentBookingStatus(studentId, bookingData) {
    if (this.io && this.studentSockets.has(studentId)) {
      this.io.to(`student-${studentId}`).emit("booking-status-update", bookingData);
      return true;
    }
    return false;
  }
}

module.exports = new SocketManager();
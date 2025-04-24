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
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 120000
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      // Add these for better production stability
      serveClient: false,
      maxHttpBufferSize: 1e8 // 100MB max payload
    });

    // Enhanced authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          console.log('Socket connection attempt without token');
          return next(new Error("Authentication error"));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          console.log('Invalid token format');
          return next(new Error("Authentication failed"));
        }
        
        socket.user = decoded;
        next();
      } catch (err) {
        console.error('Socket auth error:', err.message);
        if (err.name === 'TokenExpiredError') {
          return next(new Error("Token expired"));
        }
        return next(new Error("Authentication failed"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id, socket.user?._id);
      
      // Send connection confirmation
      socket.emit("connection-status", { 
        status: "connected", 
        socketId: socket.id,
        userId: socket.user?._id,
        timestamp: new Date()
      });

      // Handle owner connections
      socket.on("owner-join", ({ userId }, ack) => {
        if (!userId) {
          console.log('owner-join missing userId');
          return ack?.({ status: 'error', message: 'Missing userId' });
        }

        try {
          if (!this.ownerSockets.has(userId)) {
            this.ownerSockets.set(userId, new Set());
          }
          this.ownerSockets.get(userId).add(socket.id);
          socket.join(`owner-${userId}`);
          
          console.log(`Owner ${userId} joined with socket ${socket.id}`);
          ack?.({ 
            status: 'success', 
            rooms: [...socket.rooms],
            timestamp: new Date()
          });
        } catch (err) {
          console.error('owner-join error:', err);
          ack?.({ status: 'error', message: err.message });
        }
      });

      // Handle student connections (if needed)
      socket.on("student-join", ({ userId }, ack) => {
        // Similar implementation to owner-join
      });

      // Enhanced disconnection handling
      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected (${reason}):`, socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });

      // Error handling
      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      // Heartbeat mechanism
      const pingInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('ping', {}, () => {
            // Ping successful
          });
        }
      }, 20000);

      socket.on('pong', (cb) => {
        if (typeof cb === 'function') cb();
      });

      socket.on('disconnect', () => {
        clearInterval(pingInterval);
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
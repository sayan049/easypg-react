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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 120000 // 2 minutes
      },
      pingTimeout: 60000, // 60 seconds
      pingInterval: 25000 // 25 seconds
    });

    this.io.use((socket, next) => {
      // Add authentication middleware if needed
      const token = socket.handshake.auth.token;
      if (token) {
        // Verify token here if using JWT
        return next();
      }
      next(new Error("Authentication error"));
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
      socket.emit("connection-status", { status: "connected", socketId: socket.id });

      // Owner joins their room
      socket.on("owner-join", ({ userId }) => {
        if (!userId) {
          console.error("No userId provided for owner-join");
          return;
        }

        if (!this.ownerSockets.has(userId)) {
          this.ownerSockets.set(userId, new Set());
        }
        this.ownerSockets.get(userId).add(socket.id);
        socket.join(`owner-${userId}`);
        console.log(`Owner ${userId} joined with socket ID: ${socket.id}`);
        socket.emit("owner-joined", { success: true, userId });
      });

      // Student joins their room (kept for completeness)
      socket.on("student-join", ({ userId }) => {
        if (!userId) return;
        
        if (!this.studentSockets.has(userId)) {
          this.studentSockets.set(userId, new Set());
        }
        this.studentSockets.get(userId).add(socket.id);
        socket.join(`student-${userId}`);
        console.log(`Student ${userId} joined with socket ID: ${socket.id}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected (${reason}):`, socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      // Heartbeat mechanism
      socket.on("ping", (cb) => {
        if (typeof cb === "function") {
          cb("pong");
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
const { Server } = require("socket.io");

class SocketManager {
  constructor() {
    this.io = null;
    this.ownerSockets = new Map(); // ownerId -> Set of socketIds
    this.studentSockets = new Map(); // studentId -> Set of socketIds
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
      }
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Owner joins their room
      socket.on("owner-join", (ownerId) => {
        if (!this.ownerSockets.has(ownerId)) {
          this.ownerSockets.set(ownerId, new Set());
        }
        this.ownerSockets.get(ownerId).add(socket.id);
        socket.join(`owner-${ownerId}`);
        console.log(`Owner ${ownerId} joined with socket ID: ${socket.id}`);
      });

      // Student joins their room
      socket.on("student-join", (studentId) => {
        if (!this.studentSockets.has(studentId)) {
          this.studentSockets.set(studentId, new Set());
        }
        this.studentSockets.get(studentId).add(socket.id);
        socket.join(`student-${studentId}`);
        console.log(`Student ${studentId} joined with socket ID: ${socket.id}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected (${reason}):`, socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
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

  notifyOwner(ownerId, event, data) {
    if (this.io && this.ownerSockets.has(ownerId)) {
      this.io.to(`owner-${ownerId}`).emit(event, data);
      console.log(`Notified owner ${ownerId} with event "${event}"`, data);
    } else {
      console.warn(`Owner ${ownerId} not connected for event "${event}"`);
    }
  }

  notifyStudent(studentId, event, data) {
    if (this.io && this.studentSockets.has(studentId)) {
      this.io.to(`student-${studentId}`).emit(event, data);
      console.log(`Notified student ${studentId} with event "${event}"`, data);
    } else {
      console.warn(`Student ${studentId} not connected for event "${event}"`);
    }
  }

  // Broadcast to all connected owners
  notifyAllOwners(event, data) {
    if (this.io) {
      this.io.emit(event, data);
      console.log(`Broadcasted to all owners: "${event}"`);
    }
  }
}

module.exports = new SocketManager();
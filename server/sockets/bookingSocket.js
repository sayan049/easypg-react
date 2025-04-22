// sockets/bookingSocket.js
const { Server } = require("socket.io");

class SocketManager {
  constructor() {
    this.io = null;
    this.ownerRooms = new Map(); // ownerId -> socketId
    this.studentRooms = new Map(); // studentId -> socketId
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Owner joins their room
      socket.on("owner-join", (ownerId) => {
        this.ownerRooms.set(ownerId, socket.id);
        console.log(`Owner ${ownerId} joined with socket ID: ${socket.id}`);
      });

      // Student joins their room
      socket.on("student-join", (studentId) => {
        this.studentRooms.set(studentId, socket.id);
        console.log(`Student ${studentId} joined with socket ID: ${socket.id}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });
    });

    return this.io;
  }

  _cleanUpDisconnectedSocket(socketId) {
    for (const [ownerId, sid] of this.ownerRooms.entries()) {
      if (sid === socketId) {
        this.ownerRooms.delete(ownerId);
        console.log(`Owner ${ownerId} disconnected`);
      }
    }
    for (const [studentId, sid] of this.studentRooms.entries()) {
      if (sid === socketId) {
        this.studentRooms.delete(studentId);
        console.log(`Student ${studentId} disconnected`);
      }
    }
  }

  notifyOwner(ownerId, event, data) {
    const socketId = this.ownerRooms.get(ownerId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`Notified owner ${ownerId} with event "${event}"`);
    } else {
      console.warn(`Owner ${ownerId} not connected for event "${event}"`);
    }
  }

  notifyStudent(studentId, event, data) {
    const socketId = this.studentRooms.get(studentId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`Notified student ${studentId} with event "${event}"`);
    } else {
      console.warn(`Student ${studentId} not connected for event "${event}"`);
    }
  }
}

module.exports = new SocketManager();
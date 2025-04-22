// sockets/bookingSocket.js
const { Server } = require("socket.io");

const onlineOwners = new Map(); // Store ownerId -> socket.id mapping
const onlineStudents = new Map(); // Store studentId -> socket.id mapping

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Listen for owners and students joining their respective rooms
    socket.on("owner-join", (ownerId) => {
      onlineOwners.set(ownerId.toString(), socket.id);
      console.log(`Owner ${ownerId} joined with socket ID: ${socket.id}`);
    });

    socket.on("student-join", (studentId) => {
      onlineStudents.set(studentId.toString(), socket.id);
      console.log(`Student ${studentId} joined with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [ownerId, socketId] of onlineOwners.entries()) {
        if (socketId === socket.id) {
          onlineOwners.delete(ownerId);
          console.log(`Owner ${ownerId} disconnected.`);
        }
      }
      for (const [studentId, socketId] of onlineStudents.entries()) {
        if (socketId === socket.id) {
          onlineStudents.delete(studentId);
          console.log(`Student ${studentId} disconnected.`);
        }
      }
    });
  });

  return io;
}

function notifyOwner(ownerId, event, data, io) {
  const socketId = onlineOwners.get(ownerId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Notified owner ${ownerId} with event "${event}".`);
  }
}

function notifyStudent(studentId, event, data, io) {
  const socketId = onlineStudents.get(studentId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Notified student ${studentId} with event "${event}".`);
  }
}

module.exports = { initSocket, notifyOwner, notifyStudent, onlineOwners, onlineStudents };

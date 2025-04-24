const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

class SocketManager {
  constructor() {
    this.io = null;
    this.ownerSockets = new Map();
    this.studentSockets = new Map();
    this.connectionStats = {
      totalConnections: 0,
      activeConnections: 0
    };
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
        maxDisconnectionDuration: 120000,
        skipMiddlewares: true
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      serveClient: false,
      maxHttpBufferSize: 1e8
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
        if (!decoded?._id) {
          console.log('Invalid token payload');
          return next(new Error("Authentication failed"));
        }
        
        socket.user = {
          id: decoded._id,
          role: decoded.role
        };
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
      this.connectionStats.totalConnections++;
      this.connectionStats.activeConnections++;
      
      console.log(`New connection (${socket.user?.role}):`, socket.id, socket.user?.id);
      
      // Connection confirmation with additional metadata
      socket.emit("connection-status", { 
        status: "connected",
        socketId: socket.id,
        userId: socket.user?.id,
        role: socket.user?.role,
        timestamp: new Date(),
        connectionCount: this.connectionStats.activeConnections
      });

      // Handle role-based room joining
      socket.on("join-room", ({ roomType }, callback) => {
        try {
          if (!socket.user?.id) throw new Error("Unauthenticated");
          
          const roomName = `${roomType}-${socket.user.id}`;
          socket.join(roomName);
          
          if (roomType === 'owner') {
            this._trackOwnerConnection(socket.user.id, socket.id);
          } else if (roomType === 'student') {
            this._trackStudentConnection(socket.user.id, socket.id);
          }
          
          callback?.({
            status: 'success',
            room: roomName,
            timestamp: new Date()
          });
          
          console.log(`${roomType} ${socket.user.id} joined room ${roomName}`);
        } catch (err) {
          console.error('join-room error:', err.message);
          callback?.({ status: 'error', message: err.message });
        }
      });

      // Handle booking requests
      socket.on("new-booking-request", async (data, callback) => {
        try {
          if (!socket.user?.id) throw new Error("Unauthenticated");
          
          console.log('New booking request:', data);
          const success = this.notifyOwnerNewBooking(data.ownerId, {
            ...data,
            requestor: socket.user.id,
            timestamp: new Date()
          });
          
          callback?.({
            status: success ? 'success' : 'retrying',
            message: success ? 'Notification sent' : 'Owner not connected',
            timestamp: new Date()
          });
          
          if (!success) {
            // Implement retry logic or offline queue if needed
          }
        } catch (err) {
          console.error('Booking request error:', err);
          callback?.({ status: 'error', message: err.message });
        }
      });

      // Enhanced disconnection handling
      socket.on("disconnect", (reason) => {
        this.connectionStats.activeConnections--;
        console.log(`Disconnected (${reason}):`, socket.id);
        this._cleanUpDisconnectedSocket(socket.id);
      });

      // Error handling
      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      // Health check endpoint
      socket.on("health-check", (callback) => {
        callback?.({
          status: 'healthy',
          socketId: socket.id,
          uptime: process.uptime(),
          timestamp: new Date()
        });
      });
    });

    return this.io;
  }

  _trackOwnerConnection(ownerId, socketId) {
    if (!this.ownerSockets.has(ownerId)) {
      this.ownerSockets.set(ownerId, new Set());
    }
    this.ownerSockets.get(ownerId).add(socketId);
  }

  _trackStudentConnection(studentId, socketId) {
    if (!this.studentSockets.has(studentId)) {
      this.studentSockets.set(studentId, new Set());
    }
    this.studentSockets.get(studentId).add(socketId);
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
    try {
      if (!this.io) {
        console.error('Socket server not initialized');
        return false;
      }
  
      const room = `owner-${ownerId}`;
      const sockets = this.ownerSockets.get(ownerId);
  
      if (sockets?.size > 0) {
        this.io.to(room).timeout(5000).emit('new-booking', {
          ...bookingData,
          _meta: {
            sentAt: new Date(),
            deliveryAttempt: 1
          }
        }, (err, responses) => {
          if (err) {
            console.error(`Notification to owner ${ownerId} failed:`, err);
            // Implement your retry or queue logic here
            return false;
          }
          console.log(`Notification delivered to owner ${ownerId}`);
          return true;
        });
      } else {
        console.warn(`Owner ${ownerId} not connected - storing for later delivery`);
        // Implement offline storage logic here
        return false;
      }
    } catch (error) {
      console.error('Notification system error:', error);
      return false;
    }
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


  getConnectionStats() {
    return {
      ...this.connectionStats,
      connectedOwners: this.ownerSockets.size,
      connectedStudents: this.studentSockets.size,
      timestamp: new Date()
    };
  }
}

module.exports = new SocketManager();
// notifyOwnerBookingUpdate(ownerId, bookingData) {
//   if (this.io && this.ownerSockets.has(ownerId)) {
//     this.io.to(`owner-${ownerId}`).emit("booking-updated", bookingData);
//     console.log(`Notified owner ${ownerId} of booking update`);
//     return true;
//   }
//   console.warn(`Owner ${ownerId} not connected for booking update notification`);
//   return false;
// }

// // Student notification methods (kept for completeness)
// notifyStudentBookingStatus(studentId, bookingData) {
//   if (this.io && this.studentSockets.has(studentId)) {
//     this.io.to(`student-${studentId}`).emit("booking-status-update", bookingData);
//     return true;
//   }
//   return false;
// }
// }

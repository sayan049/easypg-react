// import React, { createContext, useEffect, useState, useContext } from 'react';
// import { useAuth } from "../contexts/AuthContext";
// import { io } from 'socket.io-client';
// import { baseurl } from '../constant/urls';

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const { user } = useAuth();

//   useEffect(() => {
//     if (!user?._id) {
//       setIsInitialized(false);
//       return;
//     }

//     const socketInstance = io(baseurl, {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//       auth: {
//         token: localStorage.getItem('accessToken')
//       },
//       query: {
//         userId: user._id,
//         userType: user.role
//       }
//     });

//     const onConnect = () => {
//       setIsConnected(true);
//       setIsInitialized(true);
//       setConnectionStatus('connected');
//       console.log('Socket connected:', socketInstance.id);

//       // Join appropriate room based on user role
//       if (user.role === 'owner') {
//         socketInstance.emit('owner-join', { userId: user._id }, (ack) => {
//           console.log('Owner join acknowledgement:', ack);
//         });
//       } else {
//         socketInstance.emit('user-join', { userId: user._id }, (ack) => {
//           console.log('User join acknowledgement:', ack);
//         });
//       }
//     };

//     const onDisconnect = (reason) => {
//       setIsConnected(false);
//       setConnectionStatus('disconnected');
//       console.log('Socket disconnected:', reason);
//       if (reason === 'io server disconnect') {
//         setTimeout(() => socketInstance.connect(), 1000);
//       }
//     };

//     const onConnectError = (error) => {
//       console.error('Connection error:', error);
//       if (error.message.includes("Authentication error")) {
//         console.error("Auth failed - clearing tokens");
//         localStorage.removeItem('accessToken');
//       }
//     };

//     // Set up event listeners
//     socketInstance.on('connect', onConnect);
//     socketInstance.on('disconnect', onDisconnect);
//     socketInstance.on('connect_error', onConnectError);

//     // Set initial state if already connected
//     if (socketInstance.connected) {
//       onConnect();
//     }

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.off('connect', onConnect);
//       socketInstance.off('disconnect', onDisconnect);
//       socketInstance.off('connect_error', onConnectError);
//       socketInstance.disconnect();
//       setIsInitialized(false);
//       setIsConnected(false);
//     };
//   }, [user?._id]);

//   // Enhanced emit function with retry logic
//   const emitWithAck = (event, data, timeout = 5000, retries = 3, delay = 1000) => {
//     return new Promise((resolve, reject) => {
//       const attempt = (retryCount) => {
//         console.log("soket",socket,"init",isInitialized,"connected",isConnected,"retryCount",retryCount);
//         if (!socket || !isInitialized || !isConnected) {
//           if (retryCount <= 0) {
//             return reject(new Error('Socket not ready'));
//           }
//           return setTimeout(() => attempt(retryCount - 1), delay);
//         }

//         let timedOut = false;
//         const timer = setTimeout(() => {
//           timedOut = true;
//           reject(new Error('Socket timeout'));
//         }, timeout);

//         socket.emit(event, data, (response) => {
//           if (timedOut) return;
//           clearTimeout(timer);

//           if (response?.success) {
//             resolve(response);
//           } else {
//             reject(new Error(response?.message || 'Socket error'));
//           }
//         });
//       };

//       attempt(retries);
//     });
//   };

//   return (
//     <SocketContext.Provider value={{
//       socket,
//       isConnected,
//       isInitialized,
//       emitWithAck
//     }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }

//   return {
//     ...context
//   };
// };

// export default SocketProvider;
// SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { baseurl } from "../constant/urls";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem("hasUnreadBookingUpdate") === "true";
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const newSocket = io(baseurl);
      setSocket(newSocket);
      newSocket.emit("join-user-room", user.id);

      newSocket.on("update-booking-status", (data) => {
        setHasUnread(true);
        setIsConnected(true);
        localStorage.setItem("hasUnreadBookingUpdate", "true");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, hasUnread, setHasUnread , isConnected ,setIsConnected}}>
      {children}
    </SocketContext.Provider>
  );
}

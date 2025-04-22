import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a Context to store the socket instance
const SocketContext = createContext();

// Hook to use the socket context
export const useSocket = () => useContext(SocketContext);

// Provider component to manage socket connection
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create a socket connection to the backend
    const socketIo = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

    // Set the socket instance
    setSocket(socketIo);

    // Cleanup when the component is unmounted
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

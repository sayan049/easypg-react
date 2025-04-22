import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const socketIo = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // Connection events
    socketIo.on("connect", () => {
      console.log("Socket connected:", socketIo.id);
      if (user?._id) {
        socketIo.emit("owner-join", user._id);
      }
    });

    socketIo.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketIo.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Realtime connection failed - updates may be delayed");
    });

    setSocket(socketIo);

    return () => {
      if (user?._id) {
        socketIo.emit("owner-leave", user._id);
      }
      socketIo.disconnect();
    };
  }, [user?._id]); // Reconnect when user changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
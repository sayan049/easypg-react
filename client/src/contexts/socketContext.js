// SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { baseurl } from "../constant/urls";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user, owner } = useAuth();
  const [socket, setSocket] = useState(null);
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem("hasUnreadBookingUpdate") === "true";
  });
  const [hasUnreadOwner, setHasUnreadOwner] = useState(() => {
    return localStorage.getItem("hasUnreadPendingRequest") === "true";
  });

  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const id = user?.id || owner?.id;
    if (!id) return;

    const newSocket = io(baseurl);
    setSocket(newSocket);

    if (user?.id) {
      newSocket.emit("join-user-room", user.id);
      newSocket.on("update-booking-status", (data) => {
        setHasUnread(true);
        setData(data);
        setIsConnected(true);
        localStorage.setItem("hasUnreadBookingUpdate", "true");
        if (data?.booking?.status === "confirmed") {
          localStorage.setItem("hasUnreadDashboardUpdate", "true");
        }
      });
    }

    if (owner?.id) {
      newSocket.emit("join-owner-room", owner.id);
      newSocket.on("new-booking-request", (data) => {
        setHasUnreadOwner(true);
        setData(data);
        localStorage.setItem("hasUnreadPendingRequest", "true");
        setIsConnected(true);
      });
      newSocket.on("cancel-pending-request", (data) => {
        console.log("🔥 cancel-pending-request received:", data);
        setData(data);
        setIsConnected(true);
      });
      newSocket.on("bookingExpired", (data) => {
        setHasUnreadOwner(true);
        setData(data);
        localStorage.setItem("hasUnreadPendingRequest", "true");
        setIsConnected(true);
        // Optional: show a toast or alert
        console.log("⏰ Booking expired:", data);
      });
    }

    return () => newSocket.disconnect();
  }, [user?.id, owner?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        hasUnread,
        setHasUnread,
        isConnected,
        setIsConnected,
        data,
        hasUnreadOwner,
        setHasUnreadOwner,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

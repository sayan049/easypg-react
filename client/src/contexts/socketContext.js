import React, { createContext, useEffect, useState,useContext } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { io } from 'socket.io-client';
import { baseurl } from '../constant/urls';
const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const socketInstance = io(baseurl, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: {
        token: localStorage.getItem('accessToken')
      },
      query: {
        userId: user._id,
        userType: user.role // Use the actual role from your user object
      }
    });

    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
      // Add this to verify the 'owner-join' event is being sent
      socketInstance.emit('owner-join', { userId: user._id }, (ack) => {
        console.log('Owner join acknowledgement:', ack);
      });
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        setTimeout(() => socketInstance.connect(), 1000);
      }
    };

    const onConnectError = (error) => {
      console.error('Connection error:', error);
      if (error.message.includes("Authentication error")) {
        console.error("Auth failed - clearing tokens");
        localStorage.removeItem('accessToken');
      }
    };

    // Add event listeners for debugging
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('new-booking', (data) => {
      console.log('Received new-booking:', data);
    });
    socketInstance.on('booking-updated', (data) => {
      console.log('Received booking-updated:', data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
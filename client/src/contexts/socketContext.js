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
        userType: 'owner'
      }
    });

    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
      socketInstance.emit('owner-join', { userId: user._id });
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

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    // Heartbeat
    const pingInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('ping', (response) => {
          if (response !== 'pong') socketInstance.disconnect().connect();
        });
      }
    }, 25000);

    setSocket(socketInstance);

    return () => {
      clearInterval(pingInterval);
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
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
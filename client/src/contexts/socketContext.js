// src/contexts/socketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
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
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
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
        // The server forcibly disconnected the socket
        setTimeout(() => {
          socketInstance.connect();
        }, 1000);
      }
    };

    const onConnectError = (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection problem. Trying to reconnect...');
    };

    const onError = (error) => {
      console.error('Socket error:', error);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('error', onError);
    socketInstance.on('connection-status', (data) => {
      console.log('Connection status:', data);
    });

    // Heartbeat mechanism
    const pingInterval = setInterval(() => {
      if (socketInstance.connected) {
        socketInstance.emit('ping', (response) => {
          if (response !== 'pong') {
            console.warn('No pong received, reconnecting...');
            socketInstance.disconnect().connect();
          }
        });
      }
    }, 20000);

    setSocket(socketInstance);

    return () => {
      clearInterval(pingInterval);
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.off('error', onError);
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
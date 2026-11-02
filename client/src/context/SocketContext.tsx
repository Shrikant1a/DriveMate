import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // If hosted on Netlify without custom backend URL, skip socket connection to avoid 404 noise
    const isNetlifyWithoutBackend = 
      typeof window !== 'undefined' && 
      window.location.hostname.includes('netlify.app') && 
      !import.meta.env.VITE_API_URL;

    if (isNetlifyWithoutBackend) {
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/');

    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    s.on('connect', () => {
      setIsConnected(true);
      if (user) {
        if (user.role === 'CUSTOMER') {
          s.emit('join_user', user.id);
        } else if (user.role === 'DRIVER') {
          s.emit('join_driver', user.id);
        }
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}

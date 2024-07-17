import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from './AuthService';
import { useNavigate } from 'react-router-dom';

export interface SocketContextProps {
  socket: Socket | null;
}
export const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const navigate = useNavigate();

  useEffect(() => {

    const token = getToken();
    
    if(!token) {
      navigate('/login');
    }

    const options = {
      path: '/ws',
      transportOptions: {
        polling: {
          extraHeaders: {
            'tictactoe_token': token
          }
        }
      }
    }
    const newSocket = io('http://localhost:3000', options);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  return <SocketContext.Provider value={{ socket }}> {children} </SocketContext.Provider>;
};


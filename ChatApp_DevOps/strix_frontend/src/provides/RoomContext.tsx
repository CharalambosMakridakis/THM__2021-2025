import React, { createContext, useContext, ReactNode, useState } from 'react';

interface RoomContextProps {
  roomInfo: {id: string, name: string} | null
  setRoomInfo: React.Dispatch<React.SetStateAction<{id: string, name: string} | null>>;
}

const RoomContext = createContext<RoomContextProps | undefined>(undefined);

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [roomInfo, setRoomInfo] = useState<{id: string, name: string} | null>(null);

  return <RoomContext.Provider value={{ roomInfo, setRoomInfo }}>{children}</RoomContext.Provider>;
};

export const useRoom = (): RoomContextProps => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within an AuthProvider');
  }
  return context;
};

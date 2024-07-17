import React, { createContext, useContext, ReactNode, useState } from 'react';

interface EditProfileContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileContext = createContext<EditProfileContextProps | undefined>(undefined);

interface EditProfileProviderProps {
  children: ReactNode;
}

export const EditProfileProvider: React.FC<EditProfileProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return <EditProfileContext.Provider value={{ open, setOpen }}>{children}</EditProfileContext.Provider>;
};

export const useEditProfile = (): EditProfileContextProps => {
  const context = useContext(EditProfileContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

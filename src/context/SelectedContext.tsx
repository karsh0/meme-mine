import React, { createContext, useContext, useState, useEffect } from "react";

export interface ImageContextType {
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

export const SelectedContext = createContext<ImageContextType | undefined>(undefined);

export const SelectedProvider = ({ children }: { children: any }) => {
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <SelectedContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
    </SelectedContext.Provider>
  );
};

export default SelectedProvider;
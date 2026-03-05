import React, { createContext, useState } from 'react';
import { DogProfile } from '../types/dogProfile';

export interface DogProfileContextType {
  selectedDog: DogProfile | null;
  setSelectedDog: React.Dispatch<React.SetStateAction<DogProfile | null>>;
}

export const DogProfileContext = createContext<DogProfileContextType>({
  selectedDog: null,
  setSelectedDog: () => {},
});

export const DogProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null);

  return (
    <DogProfileContext.Provider value={{ selectedDog, setSelectedDog }}>
      {children}
    </DogProfileContext.Provider>
  );
};

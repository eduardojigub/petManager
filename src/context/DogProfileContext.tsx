import React, { createContext, useState } from 'react';

// Create the context
export const DogProfileContext = createContext();

// Provider component
export const DogProfileProvider = ({ children }) => {
  const [selectedDog, setSelectedDog] = useState(null); // State for selected dog

  return (
    <DogProfileContext.Provider value={{ selectedDog, setSelectedDog }}>
      {children}
    </DogProfileContext.Provider>
  );
};

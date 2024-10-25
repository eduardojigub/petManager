import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { PetProfile } from '../interfaces/profiles';
import usePetProfiles from '../hooks/usePetProfile';


interface PetContextType {
  selectedPet: PetProfile | null;
  setSelectedPet: (pet: PetProfile | null) => void;
}


export const PetContext = createContext<PetContextType | undefined>(undefined);

interface PetProviderProps {
  children: ReactNode;
}


export const PetProvider = ({ children }: PetProviderProps) => {
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null); // Estado para o pet selecionado
const {petProfiles} = usePetProfiles();
useEffect(() => {
  if(petProfiles.length > 0)
  setSelectedPet(petProfiles[0]);
},[petProfiles])


  const contexValues = {
    selectedPet,
    setSelectedPet,
  };

  return (
    <PetContext.Provider value={contexValues}>
      {children}
    </PetContext.Provider>
  );
};


const usePetContext = () => {
  const context = React.useContext(PetContext);
  
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }

  return context;
};

export default usePetContext;

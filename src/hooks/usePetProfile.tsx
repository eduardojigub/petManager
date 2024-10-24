import { useState, useEffect } from "react";
import { PetProfile } from "../interfaces/profiles";
import useStorage from "./useStorage";
import useApi from "./useApi";

const usePetProfiles = () => {
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const { loadFromStorage, saveToStorage, removeItem } = useStorage();
  const {
    fetchPetProfilesFromApi,
    uploadPetProfileToApi,
    deletePetProfileFromApi,
  } = useApi();

  const initialLoad = async () => {
    const storedProfiles = await loadFromStorage("petProfiles");
    if (storedProfiles) {
      setPetProfiles(storedProfiles);
    } else {
      const apiProfiles = await fetchPetProfilesFromApi();
      if (apiProfiles) {
        setPetProfiles(apiProfiles);
        saveToStorage("petProfiles", apiProfiles);
      }
    }
  };

  const addNewPetProfile = async (newProfile: PetProfile) => {
    // Function to add a new pet profile
  };

  const deletePetProfile = async (profileId: string) => {
    // Function to delete a pet profile
  };

  // Load pet profiles from local storage or API
  useEffect(() => {
    initialLoad();
  }, []);

  return {
    petProfiles,
    addNewPetProfile,
    deletePetProfile,
  };
};

export default usePetProfiles;
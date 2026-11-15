import { useState, useContext, useCallback } from 'react';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/Firestore';
import { DogProfile } from '../types/dogProfile';
import { DogProfileContext, SELECTED_DOG_STORAGE_KEY } from '../context/DogProfileContext';

export function useDogProfiles() {
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const userId = getAuth().currentUser?.uid;

  const loadProfiles = useCallback(async () => {
    if (!userId) return;
    try {
      const profileSnapshot = await getDocs(
        query(collection(db, 'dogProfiles'), where('userId', '==', userId))
      );
      const profiles = profileSnapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      })) as DogProfile[];
      setDogProfiles(profiles);

      const storedDogId = await AsyncStorage.getItem(SELECTED_DOG_STORAGE_KEY);
      const savedDog = profiles.find((dog) => dog.id === storedDogId);

      if (savedDog) {
        setSelectedDog(savedDog);
      } else if (profiles.length > 0) {
        setSelectedDog(profiles[0]);
        try {
          await AsyncStorage.setItem(SELECTED_DOG_STORAGE_KEY, profiles[0].id);
        } catch (error) {
          console.error('Failed to save selected dog ID', error);
        }
      } else {
        setSelectedDog(null);
        try {
          await AsyncStorage.removeItem(SELECTED_DOG_STORAGE_KEY);
        } catch (error) {
          console.error('Failed to clear selected dog ID', error);
        }
      }
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  }, [userId, setSelectedDog]);

  const handleSelectDog = useCallback(async (dog: DogProfile) => {
    setSelectedDog(dog);
    try {
      await AsyncStorage.setItem(SELECTED_DOG_STORAGE_KEY, dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  }, [setSelectedDog]);

  return { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog };
}

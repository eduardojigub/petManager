import { useState, useContext, useCallback, useRef } from 'react';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/Firestore';
import { DogProfile } from '../types/dogProfile';
import { DogProfileContext } from '../context/DogProfileContext';

export function useDogProfiles() {
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const userId = getAuth().currentUser?.uid;
  const selectedDogIdRef = useRef(selectedDog?.id);
  selectedDogIdRef.current = selectedDog?.id;

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

      const storedDogId = await AsyncStorage.getItem('selectedDogId');
      const savedDog = profiles.find((dog) => dog.id === storedDogId);
      const targetDog = savedDog || profiles[0];

      if (targetDog && targetDog.id !== selectedDogIdRef.current) {
        setSelectedDog(targetDog);
      }
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  }, [userId, setSelectedDog]);

  const handleSelectDog = useCallback(async (dog: DogProfile) => {
    setSelectedDog(dog);
    try {
      await AsyncStorage.setItem('selectedDogId', dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  }, [setSelectedDog]);

  return { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog };
}

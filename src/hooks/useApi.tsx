import { db } from '../firebase/Firestore';
import auth from '@react-native-firebase/auth';
import { PetProfile } from '../interfaces/profiles';

const useApi = () => {
  const userId = auth().currentUser?.uid;

  const isLoggedIn = () => {
    if (!userId) {
      console.error('useApi: Error during auth check: User ID is undefined');
      return false;
    }
    return true;
  };

  const fetchPetProfilesFromApi = async (): Promise<PetProfile[] | null> => {
    if (!isLoggedIn()) {
      return null;
    }

    try {
      const profileSnapshot = await db.collection('dogProfiles').where('userId', '==', userId).get();
      const dbProfiles: PetProfile[] = profileSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PetProfile[];
      return dbProfiles;
    } catch (error) {
      console.error('useApi: Error during fetching pet profiles:', error);
      return null;
    }
  };

  const uploadPetProfileToApi = async (profile: PetProfile): Promise<void> => {
    // Function to upload pet profiles to the API
  };

  const deletePetProfileFromApi = async (profileId: string): Promise<void> => {
    // Function to delete pet profiles from the API
  };

  return {
    fetchPetProfilesFromApi,
    uploadPetProfileToApi,
    deletePetProfileFromApi,
  };
};

export default useApi;
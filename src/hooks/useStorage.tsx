import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = () => {
  const loadFromStorage = async (key: string): Promise<any | null> => {
    try {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error: unknown) {
      console.error('Error loading from local storage:', error);
      return null;
    }
  };

  const saveToStorage = async (key: string, data: unknown): Promise<void> => {
    try {
      const dataJson = JSON.stringify(data);
      await AsyncStorage.setItem(key, dataJson);
      console.log('Data saved to local storage');
    } catch (error: unknown) {
      console.error('Error saving to local storage:', error);
    }
  };

  const clearStorage = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error: unknown) {
      console.error('Error clearing local storage:', error);
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error: unknown) {
      console.error('Error removing item from local storage:', error);
    }
  };

  const getAllKeys = async (): Promise<string[] | null> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error: unknown) {
      console.error('Error getting all keys from local storage:', error);
      return null;
    }
  };
  return {
    loadFromStorage,
    saveToStorage,
    clearStorage,
    removeItem,
    getAllKeys,
  };
};

export default useStorage;
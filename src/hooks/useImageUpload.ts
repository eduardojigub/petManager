import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import storage from '@react-native-firebase/storage';

interface UseImageUploadOptions {
  resize?: boolean;
}

export default function useImageUpload(
  storagePath: string,
  options?: UseImageUploadOptions
) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async (): Promise<string | null> => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Permission to access the gallery is required!'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      let uri = result.assets[0].uri;
      if (options?.resize) {
        try {
          const manipulated = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          uri = manipulated.uri;
        } catch (error) {
          console.error('Error resizing image:', error);
          Alert.alert('Error', 'Failed to resize image.');
          return null;
        }
      }
      return uri;
    }

    console.log('Image selection was canceled or no assets available');
    return null;
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const storageRef = storage().ref(`${storagePath}/${filename}`);

    setUploading(true);

    try {
      await storageRef.putFile(uploadUri);
      const downloadURL = await storageRef.getDownloadURL();
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
      return null;
    }
  };

  return { pickImage, uploadImage, uploading };
}

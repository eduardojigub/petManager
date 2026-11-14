import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, getDownloadURL, putFile } from '@react-native-firebase/storage';

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
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be signed in to upload an image.');
      return null;
    }

    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1).split('?')[0];
    const safeName = filename.replace(/[^A-Za-z0-9._-]/g, '_') || 'image.jpg';
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const storageRef = ref(
      getStorage(),
      `users/${userId}/${storagePath}/${Date.now()}-${safeName}`,
    );

    setUploading(true);

    try {
      await putFile(storageRef, uploadUri, { contentType: contentTypeForPath(safeName) });
      const downloadURL = await getDownloadURL(storageRef);
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

function contentTypeForPath(path: string): string {
  const clean = path.toLowerCase();
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.gif')) return 'image/gif';
  if (clean.endsWith('.heic')) return 'image/heic';
  if (clean.endsWith('.heif')) return 'image/heif';
  return 'image/jpeg';
}

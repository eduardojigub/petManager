import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
} from '@react-native-firebase/firestore';

const db = getFirestore();

const getUserId = () => getAuth().currentUser?.uid;

// Add a document with the current user's ID
export const addDocument = async (collectionName: string, data: any) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');

  const newData = { ...data, userId };
  return await addDoc(collection(db, collectionName), newData);
};

// Update a document with the current user's ID check
export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');

  const newData = { ...data, userId };
  return await updateDoc(doc(db, collectionName, docId), newData);
};

// Query documents with the current user's ID
export const getUserDocuments = async (collectionName: string) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');

  const q = query(collection(db, collectionName), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Delete a document if it belongs to the current user
export const deleteUserDocument = async (collectionName: string, docId: string) => {
  const userId = getUserId();
  const docRef = doc(db, collectionName, docId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists && docSnapshot.data()?.userId === userId) {
    await deleteDoc(docRef);
  } else {
    throw new Error('Unauthorized: Document does not belong to the user');
  }
};

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

const getUserId = () => auth().currentUser?.uid;

// Add a document with the current user's ID
export const addDocument = async (collection, data) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');
  
  const newData = { ...data, userId };
  return await db.collection(collection).add(newData);
};

// Update a document with the current user's ID check
export const updateDocument = async (collection, docId, data) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');

  const newData = { ...data, userId };
  return await db.collection(collection).doc(docId).update(newData);
};

// Query documents with the current user's ID
export const getUserDocuments = async (collection) => {
  const userId = getUserId();
  if (!userId) throw new Error('User is not authenticated');

  const snapshot = await db.collection(collection).where('userId', '==', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Delete a document if it belongs to the current user
export const deleteUserDocument = async (collection, docId) => {
  const userId = getUserId();
  const docRef = db.collection(collection).doc(docId);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists && docSnapshot.data().userId === userId) {
    await docRef.delete();
  } else {
    throw new Error('Unauthorized: Document does not belong to the user');
  }
};

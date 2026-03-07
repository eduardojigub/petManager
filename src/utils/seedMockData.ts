import { collection, addDoc, getDocs, query, where } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { db } from '../firebase/Firestore';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export async function seedMockData() {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');

  // Get existing dog profile
  const dogSnapshot = await getDocs(
    query(collection(db, 'dogProfiles'), where('userId', '==', userId))
  );
  if (dogSnapshot.empty) throw new Error('No dog profiles found. Create one first.');

  const dog = { id: dogSnapshot.docs[0].id, ...dogSnapshot.docs[0].data() };
  const dogId = dog.id;

  // --- Health Records (completed) ---
  const completedRecords = [
    {
      type: 'Vaccine',
      description: 'Annual rabies vaccination',
      extraInfo: 'Rabies',
      date: daysAgo(60),
      dueDate: daysFromNow(305),
      status: 'completed',
      batchNumber: 'RB-2026-4421',
      dogId,
    },
    {
      type: 'Vaccine',
      description: 'DHPP booster shot',
      extraInfo: 'DHPP',
      date: daysAgo(45),
      dueDate: daysFromNow(320),
      status: 'completed',
      batchNumber: 'DH-2026-1187',
      dogId,
    },
    {
      type: 'Vaccine',
      description: 'Bordetella vaccine',
      extraInfo: 'Bordetella',
      date: daysAgo(30),
      dueDate: daysFromNow(335),
      status: 'completed',
      batchNumber: 'BD-2026-0093',
      dogId,
    },
    {
      type: 'Vet Appointment',
      description: 'Annual checkup - all clear',
      date: daysAgo(30),
      status: 'completed',
      vetName: 'Dr. Maria Santos',
      clinicName: 'Pet Care Clinic',
      visitWeight: '10.2',
      dogId,
    },
    {
      type: 'Vet Appointment',
      description: 'Skin allergy follow-up',
      date: daysAgo(14),
      status: 'completed',
      vetName: 'Dr. Maria Santos',
      clinicName: 'Pet Care Clinic',
      visitWeight: '10.0',
      dogId,
    },
    {
      type: 'Medication',
      description: 'Flea & tick prevention - NexGard',
      date: daysAgo(7),
      status: 'completed',
      dosage: '1 tablet',
      frequency: 'Monthly',
      dogId,
    },
    {
      type: 'Medication',
      description: 'Allergy medication - Apoquel',
      date: daysAgo(14),
      status: 'completed',
      dosage: '5.4mg',
      frequency: 'Daily for 14 days',
      dogId,
    },
    {
      type: 'Pet Groomer',
      description: 'Full grooming session',
      date: daysAgo(10),
      status: 'completed',
      services: 'Bath, haircut, nail trim, ear cleaning',
      dogId,
    },
  ];

  // --- Health Records (scheduled) ---
  const scheduledRecords = [
    {
      type: 'Vet Appointment',
      description: 'Dental cleaning',
      date: daysFromNow(5),
      time: '10:30',
      status: 'scheduled',
      vetName: 'Dr. Maria Santos',
      clinicName: 'Pet Care Clinic',
      reminderMinutes: 60,
      pushNotification: true,
      dogId,
    },
    {
      type: 'Vaccine',
      description: 'Leptospirosis vaccine',
      extraInfo: 'Leptospirosis',
      date: daysFromNow(15),
      time: '14:00',
      status: 'scheduled',
      reminderMinutes: 1440,
      pushNotification: true,
      dogId,
    },
    {
      type: 'Pet Groomer',
      description: 'Monthly grooming',
      date: daysFromNow(20),
      time: '09:00',
      status: 'scheduled',
      services: 'Bath, haircut, nail trim',
      reminderMinutes: 120,
      pushNotification: true,
      dogId,
    },
    {
      type: 'Medication',
      description: 'NexGard - next dose',
      date: daysFromNow(23),
      time: '08:00',
      status: 'scheduled',
      dosage: '1 tablet',
      frequency: 'Monthly',
      reminderMinutes: 60,
      pushNotification: true,
      dogId,
    },
  ];

  // --- Expenses (current month) ---
  const currentMonthExpenses = [
    { title: 'Premium dog food', amount: 45.99, type: 'Food', date: daysAgo(2), dogId },
    { title: 'Dog treats & chews', amount: 12.50, type: 'Food', date: daysAgo(5), dogId },
    { title: 'Vet checkup', amount: 85.00, type: 'Medical', date: daysAgo(14), dogId },
    { title: 'Allergy medication', amount: 32.00, type: 'Medical', date: daysAgo(14), dogId },
    { title: 'Grooming session', amount: 55.00, type: 'Grooming', date: daysAgo(10), dogId },
    { title: 'New chew toy', amount: 15.99, type: 'Toys', date: daysAgo(8), dogId },
    { title: 'Pee pads', amount: 18.00, type: 'Other', date: daysAgo(3), dogId },
  ];

  // --- Expenses (last month) ---
  const lastMonthExpenses = [
    { title: 'Dog food (bulk)', amount: 89.99, type: 'Food', date: daysAgo(35), dogId },
    { title: 'Annual vaccines', amount: 120.00, type: 'Medical', date: daysAgo(45), dogId },
    { title: 'Grooming', amount: 50.00, type: 'Grooming', date: daysAgo(40), dogId },
    { title: 'Interactive puzzle toy', amount: 24.99, type: 'Toys', date: daysAgo(38), dogId },
  ];

  // Write all to Firestore
  const allRecords = [...completedRecords, ...scheduledRecords];
  const allExpenses = [...currentMonthExpenses, ...lastMonthExpenses];

  const recordPromises = allRecords.map((r) => addDoc(collection(db, 'healthRecords'), r));
  const expensePromises = allExpenses.map((e) => addDoc(collection(db, 'expenses'), e));

  await Promise.all([...recordPromises, ...expensePromises]);

  return {
    healthRecords: allRecords.length,
    expenses: allExpenses.length,
  };
}

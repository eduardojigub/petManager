import { collection, addDoc, getDocs, query, where } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { db } from '../firebase/Firestore';

let callCount = 0;

async function getRandomDogId(): Promise<string> {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');
  const snapshot = await getDocs(
    query(collection(db, 'dogProfiles'), where('userId', '==', userId))
  );
  if (snapshot.empty) throw new Error('No dog profiles found. Create one first.');
  const docs = snapshot.docs;
  return docs[Math.floor(Math.random() * docs.length)].id;
}

const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

// --- Dog profile pools ---
const DOG_NAMES = ['Luna', 'Max', 'Bella', 'Charlie', 'Milo', 'Daisy', 'Rocky', 'Coco', 'Buddy', 'Lola', 'Thor', 'Nala', 'Simba', 'Toby', 'Zoe'];
const DOG_BREEDS = ['Golden Retriever', 'Labrador', 'Poodle', 'French Bulldog', 'German Shepherd', 'Beagle', 'Shih Tzu', 'Dachshund', 'Pomeranian', 'Border Collie', 'Husky', 'Corgi', 'Maltese', 'Boxer', 'Rottweiler'];
const DOG_GENDERS = ['Male', 'Female'];
const DOG_COLORS = ['White', 'Black', 'Brown', 'Golden', 'Gray', 'Cream', 'Brindle', 'Spotted'];

// --- Health record pools ---
const VACCINE_NAMES = ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Canine Influenza', 'Lyme Disease', 'Parvovirus', 'Distemper'];
const VET_NAMES = ['Dr. Maria Santos', 'Dr. João Silva', 'Dr. Ana Costa', 'Dr. Pedro Lima', 'Dr. Carolina Mendes'];
const CLINIC_NAMES = ['Pet Care Clinic', 'Happy Paws Vet', 'Animal Health Center', 'VetLife Clinic', 'Paws & Claws Hospital'];
const MEDICATION_NAMES = ['NexGard', 'Apoquel', 'Simparica', 'Bravecto', 'Heartgard', 'Rimadyl', 'Cerenia', 'Prednisone'];
const GROOMING_SERVICES = [
  'Bath, haircut, nail trim, ear cleaning',
  'Full grooming + teeth brushing',
  'Bath and blow dry',
  'Nail trim and ear cleaning',
  'De-shedding treatment + bath',
  'Puppy cut + nail trim',
];
const VET_DESCRIPTIONS = [
  'Annual checkup - all clear',
  'Skin allergy follow-up',
  'Limping on front left paw',
  'Ear infection treatment',
  'Blood work results review',
  'Dental examination',
  'Eye discharge checkup',
  'Digestive issues consultation',
];

// --- Expense pools ---
const FOOD_ITEMS = ['Premium dog food', 'Dog treats & chews', 'Grain-free kibble', 'Wet food cans', 'Dental sticks', 'Training treats', 'Puppy formula', 'Raw food mix'];
const MEDICAL_ITEMS = ['Vet checkup', 'Blood work', 'X-ray scan', 'Dental cleaning', 'Allergy medication', 'Flea prevention', 'Eye drops', 'Ear treatment'];
const GROOMING_ITEMS = ['Full grooming session', 'Bath & blow dry', 'Nail trim', 'De-shedding treatment', 'Puppy spa day'];
const TOY_ITEMS = ['Chew toy', 'Interactive puzzle', 'Rope toy', 'Squeaky ball', 'Kong toy', 'Plush toy', 'Fetch frisbee'];
const OTHER_ITEMS = ['Pee pads', 'Dog bed', 'Leash & collar', 'Dog carrier', 'Crate', 'Poop bags', 'Shampoo', 'Harness'];

function generateDogProfile(userId: string) {
  const name = randomFrom(DOG_NAMES);
  const years = Math.floor(Math.random() * 12) + 1;
  const months = Math.floor(Math.random() * 12);
  const birthday = new Date();
  birthday.setFullYear(birthday.getFullYear() - years);
  birthday.setMonth(birthday.getMonth() - months);

  return {
    name,
    breed: randomFrom(DOG_BREEDS),
    age: `${years}`,
    weight: String(randomBetween(3, 40)),
    image: null,
    userId,
    birthday: birthday.toISOString(),
    gender: randomFrom(DOG_GENDERS),
    color: randomFrom(DOG_COLORS),
    microchip: Math.random() > 0.5 ? `MC-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : '',
  };
}

function generateHealthRecords(dogId: string, count: number) {
  const records: any[] = [];

  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    let record: any;

    if (typeRoll < 0.3) {
      // Vaccine
      const vaccine = randomFrom(VACCINE_NAMES);
      record = {
        type: 'Vaccine',
        description: `${vaccine} vaccination`,
        extraInfo: vaccine,
        date: daysAgo(Math.floor(Math.random() * 90) + 1),
        dueDate: daysFromNow(Math.floor(Math.random() * 365) + 30),
        status: 'completed',
        batchNumber: `${vaccine.substring(0, 2).toUpperCase()}-${2026}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        dogId,
      };
    } else if (typeRoll < 0.55) {
      // Vet Appointment
      record = {
        type: 'Vet Appointment',
        description: randomFrom(VET_DESCRIPTIONS),
        date: daysAgo(Math.floor(Math.random() * 60) + 1),
        status: 'completed',
        vetName: randomFrom(VET_NAMES),
        clinicName: randomFrom(CLINIC_NAMES),
        visitWeight: String(randomBetween(3, 40)),
        dogId,
      };
    } else if (typeRoll < 0.8) {
      // Medication
      const med = randomFrom(MEDICATION_NAMES);
      record = {
        type: 'Medication',
        description: `${med} treatment`,
        extraInfo: med,
        date: daysAgo(Math.floor(Math.random() * 30) + 1),
        status: 'completed',
        dosage: randomFrom(['1 tablet', '5mg', '10mg', '0.5ml', '1ml']),
        frequency: randomFrom(['Daily', 'Twice daily', 'Monthly', 'Weekly', 'Every 3 months']),
        dogId,
      };
    } else {
      // Pet Groomer
      record = {
        type: 'Pet Groomer',
        description: 'Grooming session',
        date: daysAgo(Math.floor(Math.random() * 45) + 1),
        status: 'completed',
        services: randomFrom(GROOMING_SERVICES),
        dogId,
      };
    }

    records.push(record);
  }

  return records;
}

function generateScheduledRecords(dogId: string, count: number) {
  const records: any[] = [];
  const times = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00'];

  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    let record: any;
    const base = {
      date: daysFromNow(Math.floor(Math.random() * 30) + 1),
      time: randomFrom(times),
      status: 'scheduled' as const,
      reminderMinutes: randomFrom([0, 15, 60, 180, 1440]),
      pushNotification: true,
      dogId,
    };

    if (typeRoll < 0.35) {
      const vaccine = randomFrom(VACCINE_NAMES);
      record = { ...base, type: 'Vaccine', description: `${vaccine} vaccine`, extraInfo: vaccine };
    } else if (typeRoll < 0.65) {
      record = { ...base, type: 'Vet Appointment', description: randomFrom(VET_DESCRIPTIONS), vetName: randomFrom(VET_NAMES), clinicName: randomFrom(CLINIC_NAMES) };
    } else if (typeRoll < 0.85) {
      const med = randomFrom(MEDICATION_NAMES);
      record = { ...base, type: 'Medication', description: `${med} - next dose`, extraInfo: med, dosage: '1 tablet', frequency: 'Monthly' };
    } else {
      record = { ...base, type: 'Pet Groomer', description: 'Grooming appointment', services: randomFrom(GROOMING_SERVICES) };
    }

    records.push(record);
  }

  return records;
}

function generateExpenses(dogId: string, count: number) {
  const expenses: any[] = [];

  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    let expense: any;

    if (typeRoll < 0.3) {
      expense = { title: randomFrom(FOOD_ITEMS), amount: randomBetween(10, 90), type: 'Food' };
    } else if (typeRoll < 0.55) {
      expense = { title: randomFrom(MEDICAL_ITEMS), amount: randomBetween(30, 200), type: 'Medical' };
    } else if (typeRoll < 0.75) {
      expense = { title: randomFrom(GROOMING_ITEMS), amount: randomBetween(30, 80), type: 'Grooming' };
    } else if (typeRoll < 0.9) {
      expense = { title: randomFrom(TOY_ITEMS), amount: randomBetween(8, 35), type: 'Toys' };
    } else {
      expense = { title: randomFrom(OTHER_ITEMS), amount: randomBetween(10, 60), type: 'Other' };
    }

    // Spread across current and last month
    const daysBack = Math.floor(Math.random() * 60);
    expense.date = daysAgo(daysBack);
    expense.dogId = dogId;
    expense.recurring = Math.random() > 0.85;
    expense.recurringFrequency = expense.recurring ? randomFrom(['weekly', 'monthly', 'yearly']) : null;

    expenses.push(expense);
  }

  return expenses;
}

// --- Individual seed functions ---

export async function seedDogProfile() {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');
  const profile = generateDogProfile(userId);
  await addDoc(collection(db, 'dogProfiles'), profile);
  return { created: profile.name };
}

export async function seedHealthRecords() {
  const dogId = await getRandomDogId();
  const count = Math.floor(Math.random() * 4) + 3;
  const records = generateHealthRecords(dogId, count);
  await Promise.all(records.map((r) => addDoc(collection(db, 'healthRecords'), r)));
  return { added: records.length };
}

export async function seedScheduledRecords() {
  const dogId = await getRandomDogId();
  const count = Math.floor(Math.random() * 3) + 2;
  const records = generateScheduledRecords(dogId, count);
  await Promise.all(records.map((r) => addDoc(collection(db, 'healthRecords'), r)));
  return { added: records.length };
}

export async function seedExpenses() {
  const dogId = await getRandomDogId();
  const count = Math.floor(Math.random() * 5) + 3;
  const expenses = generateExpenses(dogId, count);
  await Promise.all(expenses.map((e) => addDoc(collection(db, 'expenses'), e)));
  return { added: expenses.length };
}

// --- Seed everything ---

export async function seedMockData() {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Not authenticated');

  callCount++;
  let dogsCreated = 0;

  let dogId: string;
  if (callCount % 2 === 0) {
    const profile = generateDogProfile(userId);
    const docRef = await addDoc(collection(db, 'dogProfiles'), profile);
    dogId = docRef.id;
    dogsCreated = 1;
  } else {
    try {
      dogId = await getRandomDogId();
    } catch {
      const profile = generateDogProfile(userId);
      const docRef = await addDoc(collection(db, 'dogProfiles'), profile);
      dogId = docRef.id;
      dogsCreated = 1;
    }
  }

  const healthCount = Math.floor(Math.random() * 4) + 3;
  const scheduledCount = Math.floor(Math.random() * 3) + 1;
  const expenseCount = Math.floor(Math.random() * 5) + 3;

  const healthRecords = generateHealthRecords(dogId, healthCount);
  const scheduledRecords = generateScheduledRecords(dogId, scheduledCount);
  const expenses = generateExpenses(dogId, expenseCount);
  const allRecords = [...healthRecords, ...scheduledRecords];

  await Promise.all([
    ...allRecords.map((r) => addDoc(collection(db, 'healthRecords'), r)),
    ...expenses.map((e) => addDoc(collection(db, 'expenses'), e)),
  ]);

  return { dogsCreated, healthRecords: allRecords.length, expenses: expenses.length };
}

import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { getAuth } from '@react-native-firebase/auth';

export function useProfileData() {
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [healthCount, setHealthCount] = useState(0);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);
  const prevUserIdRef = useRef<string | undefined>(undefined);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
      setSelectedDog(null);
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  const loadDogData = useCallback(async () => {
    if (!selectedDog || !userId) return;
    const currentLoadId = ++loadIdRef.current;
    setIsLoading(true);

    try {
      const healthSnapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );
      const allHealthRecords = healthSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      const scheduled = allHealthRecords.filter((r: any) => r.status === 'scheduled');

      const expensesSnapshot = await getDocs(
        query(collection(db, 'expenses'), where('dogId', '==', selectedDog.id))
      );
      const allExpenses = expensesSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const thisMonthTotal = allExpenses
        .filter((e: any) => e.date >= startOfMonth)
        .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

      const activities: any[] = [];
      allHealthRecords.forEach((r: any) => {
        const label = r.status === 'scheduled' ? 'Scheduled' : 'Record added';
        activities.push({ id: r.id, title: `${r.type} — ${r.description || label}`, date: r.date, icon: r.status === 'scheduled' ? 'schedule' : 'health', type: r.type });
      });
      allExpenses.forEach((e: any) => {
        activities.push({ id: e.id, title: `${e.title || e.type} — $${(e.amount || 0).toFixed(2)}`, date: e.date, icon: 'expense', type: e.type });
      });
      activities.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (currentLoadId === loadIdRef.current) {
        setScheduledCount(scheduled.length);
        setHealthCount(allHealthRecords.length);
        setMonthExpenses(thisMonthTotal);
        setRecentActivity(activities.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dog data:', error);
    } finally {
      if (currentLoadId === loadIdRef.current) setIsLoading(false);
    }
  }, [selectedDog, userId]);

  return {
    user, userId, scheduledCount, healthCount, monthExpenses,
    recentActivity, isLoading, loadDogData,
  };
}

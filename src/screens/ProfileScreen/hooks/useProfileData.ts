import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { getAuth } from '@react-native-firebase/auth';

export function useProfileData() {
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [healthCount, setHealthCount] = useState(0);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => { setSelectedDog(null); }, [userId]);

  const loadDogData = useCallback(async () => {
    if (!selectedDog || !userId) return;
    const currentLoadId = ++loadIdRef.current;
    setIsLoading(true);

    try {
      const schedulesSnapshot = await getDocs(
        query(collection(db, 'schedules'), where('dogId', '==', selectedDog.id), where('userId', '==', userId))
      );
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const schedules = schedulesSnapshot.docs
        .map((d: any) => {
          const data = d.data();
          const [year, month, day] = data.date.split('-').map(Number);
          const [hours, minutes] = data.time.split(':').map(Number);
          return { id: d.id, ...data, isUpcoming: new Date(year, month - 1, day, hours, minutes) >= today };
        })
        .filter((s: any) => s.isUpcoming);

      const healthSnapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );

      const expensesSnapshot = await getDocs(
        query(collection(db, 'expenses'), where('dogId', '==', selectedDog.id))
      );
      const allExpenses = expensesSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const thisMonthTotal = allExpenses
        .filter((e: any) => e.date >= startOfMonth)
        .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

      const activities: any[] = [];
      healthSnapshot.docs.forEach((d: any) => {
        const data = d.data();
        activities.push({ id: d.id, title: `${data.type} — ${data.description || 'Record added'}`, date: data.date, icon: 'health', type: data.type });
      });
      allExpenses.forEach((e: any) => {
        activities.push({ id: e.id, title: `${e.title || e.type} — $${(e.amount || 0).toFixed(2)}`, date: e.date, icon: 'expense', type: e.type });
      });
      schedulesSnapshot.docs.forEach((d: any) => {
        const data = d.data();
        activities.push({ id: d.id, title: `${data.type} — ${data.description || 'Scheduled'}`, date: data.date, icon: 'schedule', type: data.type });
      });
      activities.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (currentLoadId === loadIdRef.current) {
        setUpcomingSchedules(schedules);
        setHealthCount(healthSnapshot.docs.length);
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
    user, userId, upcomingSchedules, healthCount, monthExpenses,
    recentActivity, isLoading, loadDogData,
  };
}

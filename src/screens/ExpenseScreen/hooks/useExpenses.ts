import { useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { confirmDelete } from '../../../utils/confirmDelete';

export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const generateRecurringExpenses = async (
    allData: any[], monthIndex: number, year: number,
  ): Promise<any[]> => {
    const recurringExpenses = allData.filter((e) => e.recurring && e.recurringFrequency);
    const newExpenses: any[] = [];

    for (const expense of recurringExpenses) {
      const originalDate = new Date(expense.date);
      const origMonth = originalDate.getMonth();
      const origYear = originalDate.getFullYear();
      const origDay = originalDate.getDate();

      if (year < origYear || (year === origYear && monthIndex <= origMonth)) continue;

      let shouldGenerate = false;
      if (expense.recurringFrequency === 'weekly') {
        const diffMs = new Date(year, monthIndex, origDay).getTime() - originalDate.getTime();
        shouldGenerate = diffMs / (7 * 24 * 60 * 60 * 1000) >= 1;
      } else if (expense.recurringFrequency === 'monthly') {
        shouldGenerate = true;
      } else if (expense.recurringFrequency === 'yearly') {
        shouldGenerate = monthIndex === origMonth;
      }

      if (!shouldGenerate) continue;

      const alreadyExists = allData.some((e) => {
        if (e.recurringSourceId !== expense.id) return false;
        const eDate = new Date(e.date);
        return eDate.getMonth() === monthIndex && eDate.getFullYear() === year;
      });

      if (alreadyExists) continue;

      const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
      const targetDay = Math.min(origDay, lastDayOfMonth);
      const targetDate = new Date(year, monthIndex, targetDay);

      const newExpense = {
        title: expense.title,
        amount: expense.amount,
        type: expense.type,
        date: targetDate.toISOString(),
        dogId: expense.dogId,
        recurring: false,
        recurringFrequency: null,
        recurringSourceId: expense.id,
      };

      try {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        newExpenses.push({ ...newExpense, id: docRef.id });
      } catch (error) {
        console.error('Error creating recurring expense:', error);
      }
    }
    return newExpenses;
  };

  const updateFilteredExpenses = useCallback((all: any[], monthIndex: number, year: number) => {
    const filtered = all.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
    });
    setExpenses(filtered);
  }, []);

  const fetchExpenses = useCallback(async (monthIndex: number, year: number) => {
    if (!selectedDog) {
      setExpenses([]);
      setAllExpenses([]);
      return;
    }
    try {
      const snapshot = await getDocs(
        query(collection(db, 'expenses'), where('dogId', '==', selectedDog.id))
      );
      const expensesData = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      const generated = await generateRecurringExpenses(expensesData, monthIndex, year);
      const allData = [...expensesData, ...generated];
      const sorted = allData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllExpenses(sorted);
      updateFilteredExpenses(sorted, monthIndex, year);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, [selectedDog, updateFilteredExpenses]);

  const handleConfirmDelete = (id: string, monthIndex: number, year: number) => {
    confirmDelete({
      title: t('alert.deleteExpense'),
      message: t('alert.deleteExpenseMsg'),
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'expenses', id));
          const updated = allExpenses.filter((e) => e.id !== id);
          setAllExpenses(updated);
          updateFilteredExpenses(updated, monthIndex, year);
          Alert.alert(t('common.success'), t('alert.expenseDeleted'));
        } catch (error) {
          console.error('Error deleting expense:', error);
          Alert.alert(t('common.error'), t('alert.failedDeleteExpense'));
        }
      },
    });
  };

  const handleDeleteAll = (monthIndex: number, year: number) => {
    if (expenses.length === 0) return;
    Alert.alert(
      t('alert.deleteAllExpenses'),
      t('alert.deleteAllExpensesMsg', { count: String(expenses.length) }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.allSettled(
                expenses.map(async (e) => deleteDoc(doc(db, 'expenses', e.id)))
              );
              const updated = allExpenses.filter((e) => !expenses.find((exp) => exp.id === e.id));
              setAllExpenses(updated);
              updateFilteredExpenses(updated, monthIndex, year);
              Alert.alert(t('common.success'), t('alert.allExpensesDeleted'));
            } catch (error) {
              console.error('Error deleting all expenses', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllExpenses'));
            }
          },
        },
      ]
    );
  };

  return {
    expenses, allExpenses, fetchExpenses, updateFilteredExpenses,
    handleConfirmDelete, handleDeleteAll,
  };
}

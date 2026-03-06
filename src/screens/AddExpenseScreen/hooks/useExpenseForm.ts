import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';

export function useExpenseForm(expense: any) {
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const [expenseTitle, setExpenseTitle] = useState(expense?.title || '');
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [date, setDate] = useState(expense?.date ? new Date(expense.date) : new Date());
  const [type, setType] = useState(expense?.type || '');
  const [recurring, setRecurring] = useState(expense?.recurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly' | 'yearly'>(
    expense?.recurringFrequency || 'monthly'
  );

  const handleAmountChange = (value: string) => {
    let cleaned = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = cleaned.split('.');
    if (integerPart === '' && cleaned === '.') { setAmount('0.'); return; }
    if (cleaned.split('.').length > 2) return;
    const limitedDecimal = decimalPart ? decimalPart.substring(0, 2) : '';
    const formattedInteger = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
    setAmount(decimalPart !== undefined ? `${formattedInteger}.${limitedDecimal}` : formattedInteger);
  };

  const handleSave = async (onSuccess: (addedExpense?: any) => void) => {
    if (!type) { Alert.alert(t('common.error'), t('alert.selectType')); return; }
    if (!expenseTitle.trim()) { Alert.alert(t('common.error'), t('alert.addTitle')); return; }
    if (!amount) { Alert.alert(t('common.error'), t('alert.addAmount')); return; }

    const newExpense = {
      title: expenseTitle,
      amount: parseFloat(amount.replace(/,/g, '')),
      type, date: date.toISOString(), dogId: selectedDog!.id,
      recurring, recurringFrequency: recurring ? recurringFrequency : null,
    };

    try {
      if (expense) {
        await updateDoc(doc(db, 'expenses', expense.id), newExpense);
      } else {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        onSuccess({ ...newExpense, id: docRef.id });
        return;
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving expense', error);
      Alert.alert(t('common.error'), t('alert.failedSaveExpense'));
    }
  };

  return {
    expenseTitle, setExpenseTitle, amount, handleAmountChange, date, setDate,
    type, setType, recurring, setRecurring, recurringFrequency, setRecurringFrequency,
    handleSave, t,
  };
}

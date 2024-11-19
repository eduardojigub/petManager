import React, { useContext, useState } from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Container,
  Title,
  Input,
  CustomButton,
  ButtonText,
  DatePickerButton,
  DatePickerText,
} from './styles';

import {
  TypeSelector, // Import styled components for Type selection
  TypeOption,
  TypeText,
} from '../AddHealthRecord/styles';

import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native'; // Assuming you are using phosphor-react-native for icons

export default function AddExpenseScreen({ navigation, route }) {
  const { expense } = route.params || {};

  const [expenseTitle, setExpenseTitle] = useState(expense?.title || '');
  const [amount, setAmount] = useState(expense?.amount ? String(expense.amount) : '');
  const [date, setDate] = useState( expense?.date ? new Date(expense.date) : new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [type, setType] = useState( expense?.type || ''); // State for expense type
  const { selectedDog } = useContext(DogProfileContext);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAmountChange = (value) => {
    // Remove non-numeric characters except for the period (.)
    let cleaned = value.replace(/[^0-9.]/g, '');
  
    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = cleaned.split('.');
  
    // If user types only a decimal without an integer, do not block them
    if (integerPart === '' && cleaned === '.') {
      setAmount('0.');
      return;
    }
  
    // Ensure only one decimal point is allowed
    if (cleaned.split('.').length > 2) {
      return; // Prevent further input if more than one decimal point is detected
    }
  
    // If there's a decimal part, limit it to 2 digits
    const limitedDecimalPart = decimalPart ? decimalPart.substring(0, 2) : '';
  
    // Format the integer part with commas (but skip formatting while typing the decimal part)
    const formattedIntegerPart = integerPart
      ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for every 3 digits
      : '';
  
    // Update the state, ensuring the decimal part is not formatted while typing
    if (decimalPart !== undefined) {
      setAmount(`${formattedIntegerPart}.${limitedDecimalPart}`);
    } else {
      setAmount(formattedIntegerPart);
    }
  };
  

  const expenseTypes = [
    { label: 'Food', icon: <Icon.ForkKnife size={20} color="#7289DA" /> },
    { label: 'Medical', icon: <Icon.Stethoscope size={20} color="#7289DA" /> },
    { label: 'Grooming', icon: <Icon.Scissors size={20} color="#7289DA" /> },
    { label: 'Toys', icon: <Icon.PuzzlePiece size={20} color="#7289DA" /> },
    { label: 'Other', icon: <Icon.FileText size={20} color="#7289DA" /> },
  ];

// Updated handleSave function to remove commas before saving
const handleSave = async () => {
  if (!expenseTitle || !amount || !date || !type) {
    Alert.alert('Please fill out all fields');
    return;
  }

  // Remove commas from the amount before saving it as a float
  const cleanedAmount = amount.replace(/,/g, '');

  const newExpense = {
    title: expenseTitle,
    amount: parseFloat(cleanedAmount), // Parse the cleaned amount as a float
    type, // Save the selected type
    date: date.toISOString(), // Save the full ISO date string
    dogId: selectedDog.id,
  };

  try {
    if (expense) {
      // Update the existing expense
      await db.collection('expenses').doc(expense.id).update(newExpense);
    } else {
      // Edit the existing expense or add a new one if it doesn't exist
      const docRef = await db.collection('expenses').add(newExpense);
      const addedExpense = { ...newExpense, id: docRef.id };
      if (route.params?.addExpense) route.params.addExpense(addedExpense);
    }
    navigation.goBack();
  } catch (error) {
    console.error('Error saving expense', error);
    Alert.alert('Error', 'Unable to save the expense.');
  }
};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <Title>{expense ? 'Edit Expense' : 'Add Expense'}</Title>

          {/* Expense Type Selection */}
          <TypeSelector>
            {expenseTypes.map((item) => (
              <TypeOption
                key={item.label}
                onPress={() => setType(item.label)}
                selected={type === item.label}
              >
                {item.icon}
                <TypeText selected={type === item.label}>{item.label}</TypeText>
              </TypeOption>
            ))}
          </TypeSelector>

          <Input
            value={expenseTitle}
            onChangeText={setExpenseTitle}
            placeholder="Expense title"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Input
            value={amount}
            onChangeText={handleAmountChange} // Call the format function to format the input
            placeholder="Amount ($): Example: 10.99"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Date Picker Button */}
          <DatePickerButton onPress={() => setShowDateModal(true)}>
            <DatePickerText>{formattedDate}</DatePickerText>
          </DatePickerButton>

          {/* Date Picker Modal for iOS only */}
          {Platform.OS === 'ios' && showDateModal && (
            <Modal
              visible={showDateModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDateModal(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    width: '90%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      marginBottom: 10,
                    }}
                  >
                    Select Date
                  </Text>

                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity onPress={() => setShowDateModal(false)}>
                      <Text style={{ color: '#7289DA', fontSize: 16 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDateModal(false)}>
                      <Text style={{ color: '#7289DA', fontSize: 16 }}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {/* Date Picker Direct for Android */}
          {Platform.OS === 'android' && showDateModal && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
                setShowDateModal(false); // Close DateTimePicker after selection
              }}
            />
          )}

          <CustomButton onPress={handleSave}>
          <ButtonText>{expense ? 'Update Expense' : 'Save Expense'}</ButtonText>
          </CustomButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

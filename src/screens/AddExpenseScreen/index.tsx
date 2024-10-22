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
  TypeText
} from '../AddHealthRecord/styles'

import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native'; // Assuming you are using phosphor-react-native for icons

export default function AddExpenseScreen({ navigation, route }) {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [type, setType] = useState(''); // State for expense type
  const { selectedDog } = useContext(DogProfileContext);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expenseTypes = [
    { label: 'Food', icon: <Icon.ForkKnife size={20} color="#7289DA" /> },
    { label: 'Medical', icon: <Icon.Stethoscope size={20} color="#7289DA" /> },
    { label: 'Grooming', icon: <Icon.Scissors size={20} color="#7289DA" /> },
    { label: 'Toys', icon: <Icon.PuzzlePiece size={20} color="#7289DA" /> },
    { label: 'Other', icon: <Icon.FileText size={20} color="#7289DA" /> },
  ];

  const handleSave = async () => {
    if (!expenseTitle || !amount || !date || !type) {
      Alert.alert('Please fill out all fields');
      return;
    }

    const newExpense = {
      title: expenseTitle,
      amount: parseFloat(amount),
      type, // Save the selected type
      date: date.toISOString(), // Save the full ISO date string
      dogId: selectedDog.id,
    };

    try {
      await db.collection('expenses').add(newExpense);
      if (route.params?.addExpense) route.params.addExpense(newExpense);
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
          <Title>Add an Expense</Title>

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
            onChangeText={setAmount}
            placeholder="Amount"
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
                      setShowDateModal(false); // Close after selection
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
            <ButtonText>Save Expense</ButtonText>
          </CustomButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

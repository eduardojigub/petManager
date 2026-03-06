import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

export const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  color: #333;
  font-family: 'Poppins_700Bold';
  margin-bottom: 12px;
`;

export const TypeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

export const TypeChip = styled.TouchableOpacity<{ selected?: boolean; selectedBg?: string }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-radius: 14px;
  background-color: ${({ selected, selectedBg }) => (selected ? (selectedBg || '#41245c') : '#fff')};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 1;
`;

export const TypeChipText = styled.Text<{ selected?: boolean; selectedColor?: string }>`
  font-size: 14px;
  color: ${({ selected, selectedColor }) => (selected ? (selectedColor || '#fff') : '#666')};
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;

export const FormCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
  margin-bottom: 20px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const InputLabel = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_500Medium';
  margin-bottom: 6px;
  margin-left: 4px;
`;

export const MultilineInput = styled.TextInput`
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
  min-height: 100px;
  text-align-vertical: top;
`;

export const DateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const DateButtonText = styled.Text<{ hasValue?: boolean }>`
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
  color: ${({ hasValue }) => (hasValue ? '#333' : '#aaa')};
  font-family: 'Poppins_400Regular';
`;

export const ReminderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const ReminderLabel = styled.Text`
  font-size: 14px;
  color: #333;
  font-family: 'Poppins_500Medium';
  flex: 1;
  margin-left: 10px;
`;

export const ReminderChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const ReminderChip = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${({ selected }) => (selected ? '#41245c' : '#f8f8f8')};
`;

export const ReminderChipText = styled.Text<{ selected?: boolean }>`
  font-size: 13px;
  color: ${({ selected }) => (selected ? '#fff' : '#666')};
  font-family: 'Poppins_500Medium';
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #41245c;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 20px;
`;

export const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Poppins_600SemiBold';
`;

import styled from 'styled-components/native';
import { Image } from 'expo-image';
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

// Type selector section
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

// Form card
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

export const InputWithIcon = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
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

// Image
export const ImageSection = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

export const ImagePreview = styled(Image)`
  width: 100%;
  height: 200px;
  border-radius: 14px;
  margin-bottom: 10px;
`;

export const ImageButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f0eff4;
  padding: 14px;
  border-radius: 14px;
  width: 100%;
`;

export const ImageButtonText = styled.Text`
  font-size: 14px;
  color: #41245c;
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;

// Save button
export const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#41245c')};
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

// Reminder toggle
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

export const ReminderDaysRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const ReminderDayChip = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${({ selected }) => (selected ? '#41245c' : '#f8f8f8')};
`;

export const ReminderDayText = styled.Text<{ selected?: boolean }>`
  font-size: 13px;
  color: ${({ selected }) => (selected ? '#fff' : '#666')};
  font-family: 'Poppins_500Medium';
`;

// Optional badge
export const OptionalBadge = styled.Text`
  font-size: 11px;
  color: #aaa;
  font-family: 'Poppins_400Regular';
  margin-left: 4px;
`;

export const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

// Placeholder
export const PlaceholderContainer = styled.View`
  align-items: center;
  margin-top: 40px;
`;

export const PlaceholderText = styled.Text`
  color: #aaa;
  font-size: 15px;
  font-family: 'Poppins_400Regular';
  margin-top: 10px;
`;

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
  padding-top: 30px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
  margin-bottom: 14px;
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
  padding: 10px 16px;
  border-radius: 24px;
  background-color: ${({ selected, selectedBg }) =>
    selected ? selectedBg || '#f0eff4' : '#fff'};
  border-width: ${({ selected }) => (selected ? '2px' : '1px')};
  border-color: ${({ selected }) => (selected ? '#41245c' : '#e0e0e0')};
`;

export const TypeChipText = styled.Text<{ selected?: boolean; selectedColor?: string }>`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ selected, selectedColor }) =>
    selected ? selectedColor || '#41245c' : '#666'};
  font-family: ${({ selected }) => (selected ? 'Poppins_700Bold' : 'Poppins_600SemiBold')};
`;

export const FormCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
  elevation: 1;
`;

export const InputGroup = styled.View`
  margin-bottom: 18px;
`;

export const InputLabel = styled.Text`
  font-size: 13px;
  color: #666;
  font-family: 'Poppins_600SemiBold';
  margin-bottom: 8px;
`;

export const StyledInput = styled.TextInput`
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
`;

export const DateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 12px;
  padding: 14px 16px;
`;

export const DateButtonText = styled.Text<{ hasValue?: boolean }>`
  font-size: 15px;
  color: ${({ hasValue }) => (hasValue ? '#333' : '#ccc')};
  font-family: 'Poppins_400Regular';
  margin-left: 10px;
`;

export const RecurringRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const RecurringLabel = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
  margin-left: 10px;
  flex: 1;
`;

export const FrequencyChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const FrequencyChip = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${({ selected }) => (selected ? '#41245c' : '#f0eff4')};
`;

export const FrequencyChipText = styled.Text<{ selected?: boolean }>`
  font-size: 13px;
  color: ${({ selected }) => (selected ? '#fff' : '#666')};
  font-family: 'Poppins_600SemiBold';
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #41245c;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 40px;
`;

export const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
`;

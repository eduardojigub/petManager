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

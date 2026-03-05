import styled from 'styled-components/native';
import { Image } from 'expo-image';
export { KeyboardAvoidingContainer, TypeSelector, TypeOption, TypeText } from '../../styles/shared';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #41245C;
`;


export const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #fff;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #41245C;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ImagePreview = styled(Image)`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-top: 20px;
  align-self: center;
  border-width: 1px;
  border-color: #ddd;
`;

export const DatePickerButton = styled.TouchableOpacity`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
`;

export const DatePickerText = styled.Text`
  color: #333;
  font-size: 16px;
`;

export const PlaceholderContainer = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

export const PlaceholderText = styled.Text`
  color: #7289DA;
  font-size: 16px;
  margin-top: 10px;
`;


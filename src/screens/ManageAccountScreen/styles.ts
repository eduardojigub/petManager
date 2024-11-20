import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-bottom: 24px;
  text-align: center;
`;

export const InputContainer = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 16px;
  color: #000;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #F1F1F1;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  color: #000;
`;

export const Button = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  color: #E74C3C;
  margin-bottom: 16px;
  text-align: center;
`;

export const TogglePasswordIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 50%;
`;
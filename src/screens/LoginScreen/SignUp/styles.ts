import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 15px;
  margin-top: 10px;
  border-radius: 5px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

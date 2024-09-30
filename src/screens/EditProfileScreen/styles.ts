import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  width: 80%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 15px 30px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

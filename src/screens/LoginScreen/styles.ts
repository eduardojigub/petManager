import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: #f5f5f5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: #fff;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

export const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 16px;
`;

export const SwitchModeButton = styled.TouchableOpacity`
  background-color: #888;
  padding: 15px;
  border-radius: 5px;
`;

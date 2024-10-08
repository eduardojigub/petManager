import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const HeaderWrapper = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-top: 24px;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 16px;
  color: #7C7C7C;
  margin-top: 6px;
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

export const CustomButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
`;

export const TogglePasswordIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 42px;
`;

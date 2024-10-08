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
  text-align: center;
`;

export const InputContainer = styled.View`
  margin-bottom: 16px;
`;

export const Input = styled.TextInput`
  background-color: #F1F1F1;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  color: #000;
  placeholder-text-color: #7C7C7C;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #41245C;
  margin-top: 20px;
  border-radius: 20px;
  height: 50px;
  width: 250px;
  justify-content: center;
  align-items: center;
  align-self: center;
  border: 2px solid #41245C;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
`;

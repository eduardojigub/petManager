import styled from 'styled-components/native';
export {
  LoginContainer as Container,
  HeaderWrapper,
  HeaderTitle,
  HeaderSubtitle,
  InputContainer,
  LoginInput as Input,
} from '../sharedStyles';

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

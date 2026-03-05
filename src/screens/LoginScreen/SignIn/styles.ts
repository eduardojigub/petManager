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
  margin-top: 50px;
  border-radius: 20px;
  height: 50px;
  width: 250px;
  justify-content: center;
  align-items: center;
  border: 2px solid #41245C;
  align-self: center;
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

export const ForgotPasswordContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  margin-top: 8px;
`;

export const ForgotPasswordLink = styled.Text`
  color: #EBA059;
  font-size: 14px;
  text-decoration-line: underline;
`;

export const SignUpLinkContainer = styled.View`
  align-items: center;
  margin-top: 55px;
`;

export const SignUpText = styled.Text`
  font-size: 14px;
  color: #7C7C7C;
`;

export const SignUpLink = styled.Text`
  color: #EBA059;
  font-size: 14px;
  text-decoration-line: underline;
`;

export const TogglePasswordIconSignIn = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 12px;
`;
import styled from 'styled-components/native';
export { KeyboardAvoidingContainer } from '../../../styles/shared';
export {
  LoginContainer as Container,
  HeaderWrapper,
  HeaderTitle,
  HeaderSubtitle,
  InputContainer,
  LoginInput as Input,
} from '../sharedStyles';

export const Label = styled.Text`
  font-size: 16px;
  color: #41245C;
  margin-bottom: 8px;
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
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_400Regular';
`;

export const TogglePasswordIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 42px;
`;

export const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const CheckboxLabel = styled.Text`
  color: #7C7C7C;
  font-size: 16px;
  margin-left: 5px;
`;

export const SignInLinkContainer = styled.View`
  align-items: center;
  margin-top: 55px;
`;

export const SignInText = styled.Text`
  font-size: 14px;
  color: #7C7C7C;
`;

export const SignInLink = styled.Text`
  color: #EBA059;
  font-size: 14px;
  font-weight: bold;
  text-decoration-line: underline;
`;


export const TermsLink = styled.Text`
  color: #EBA059;
  font-size: 14px;
  text-decoration-line: underline;
`;

export const TermsModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const TermsModalContent = styled.View`
  width: 90%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
`;

export const TermsTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TermsScrollView = styled.ScrollView`
  max-height: 400px;
`;

export const TermsBodyText = styled.Text`
  font-size: 14px;
`;


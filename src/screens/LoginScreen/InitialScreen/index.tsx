import React from 'react';
import { Container, TitleWrapper,SmallText, TitleContainer, Title, HighlightedTitle, Title2, ButtonSignUP, ButtonSignIN, ButtonText, StyledImage } from './styles';
import { useNavigation } from '@react-navigation/native';
import loginScreenImage from '../../../assets/loginScreenImage.png';

export default function InitialScreen() {
  const navigation = useNavigation();

  return (
    <Container>
      <TitleWrapper>
        <TitleContainer>
          <Title>Your </Title>
          <HighlightedTitle>Pet's life,</HighlightedTitle>
        </TitleContainer>
        <Title2>organized!</Title2>
      </TitleWrapper>
      <StyledImage source={loginScreenImage} />
      <ButtonSignIN onPress={() => navigation.navigate('SignIn')}>
        <ButtonText>Sign In</ButtonText>
      </ButtonSignIN>
      <SmallText>Don't have an account?</SmallText>
      <ButtonSignUP onPress={() => navigation.navigate('SignUp')}>
        <ButtonText>Sign Up</ButtonText>
      </ButtonSignUP>
    </Container>
  );
}

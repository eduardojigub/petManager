import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import {
  Container,
  ImageWrapper,
  CircularImageContainer,
  CircularImage,
  FloatingBall,
  TitleWrapper,
  TitleContainer,
  Title,
  HighlightedTitle,
  Title2,
  Subtitle,
  ButtonSignIN,
  ButtonTextSignIN,
  SmallText,
  ButtonSignUP,
  ButtonTextSignUP,
  LanguagePill,
  FlagButton,
  FlagText,
  VersionText,
} from './styles';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Heart, House, Bone, CalendarDots, CurrencyDollar } from 'phosphor-react-native';
import initialScreenDog from '../../../assets/initialScreenDog.png';
import { LanguageContext } from '../../../context/LanguageContext';

function useFloatingAnimation(duration: number, distance: number) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -distance,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: distance,
          duration: duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return translateY;
}

export default function InitialScreen() {
  const navigation = useNavigation();
  const { t, locale, setLocale } = useContext(LanguageContext);

  const float1 = useFloatingAnimation(2000, 6);
  const float2 = useFloatingAnimation(2400, 5);
  const float3 = useFloatingAnimation(1800, 7);
  const float4 = useFloatingAnimation(2200, 5);
  const float5 = useFloatingAnimation(2600, 6);

  return (
    <Container>
      <LanguagePill>
        <FlagButton selected={locale === 'en'} onPress={() => setLocale('en')}>
          <FlagText>🇺🇸</FlagText>
        </FlagButton>
        <FlagButton selected={locale === 'pt'} onPress={() => setLocale('pt')}>
          <FlagText>🇧🇷</FlagText>
        </FlagButton>
      </LanguagePill>

      <ImageWrapper>
        <CircularImageContainer>
          <CircularImage source={initialScreenDog} />
        </CircularImageContainer>

        <Animated.View style={{ position: 'absolute', top: -5, right: -5, transform: [{ translateY: float1 }] }}>
          <FloatingBall>
            <Heart size={22} color="#E74C3C" weight="fill" />
          </FloatingBall>
        </Animated.View>

        <Animated.View style={{ position: 'absolute', top: '35%', left: -15, transform: [{ translateY: float2 }] }}>
          <FloatingBall>
            <House size={22} color="#41245C" weight="fill" />
          </FloatingBall>
        </Animated.View>

        <Animated.View style={{ position: 'absolute', bottom: '10%', left: -5, transform: [{ translateY: float3 }] }}>
          <FloatingBall>
            <Bone size={22} color="#7289DA" weight="fill" />
          </FloatingBall>
        </Animated.View>

        <Animated.View style={{ position: 'absolute', top: '55%', right: -15, transform: [{ translateY: float4 }] }}>
          <FloatingBall>
            <CalendarDots size={22} color="#EBA059" weight="fill" />
          </FloatingBall>
        </Animated.View>

        <Animated.View style={{ position: 'absolute', bottom: -5, right: 20, transform: [{ translateY: float5 }] }}>
          <FloatingBall>
            <CurrencyDollar size={22} color="#27AE60" weight="bold" />
          </FloatingBall>
        </Animated.View>
      </ImageWrapper>

      <TitleWrapper>
        <TitleContainer>
          <Title>{t('initial.titlePart1')}</Title>
          <HighlightedTitle>{t('initial.titleHighlight')}</HighlightedTitle>
        </TitleContainer>
        <Title2>{t('initial.titlePart2')}</Title2>
      </TitleWrapper>

      <Subtitle>
        {t('initial.subtitle')}
      </Subtitle>

      <ButtonSignIN onPress={() => navigation.navigate('SignIn')}>
        <ButtonTextSignIN>{t('initial.login')}</ButtonTextSignIN>
      </ButtonSignIN>

      <SmallText>{t('initial.noAccount')}</SmallText>

      <ButtonSignUP onPress={() => navigation.navigate('SignUp')}>
        <ButtonTextSignUP>{t('initial.register')}</ButtonTextSignUP>
      </ButtonSignUP>

      <VersionText>v{Constants.expoConfig?.version}</VersionText>
    </Container>
  );
}

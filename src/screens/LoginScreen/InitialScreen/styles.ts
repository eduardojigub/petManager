import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px;
`;

export const ImageWrapper = styled.View`
  width: 320px;
  height: 320px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: visible;
`;

export const CircularImageContainer = styled.View`
  width: 300px;
  height: 300px;
  border-radius: 150px;
  overflow: hidden;
`;

export const CircularImage = styled(Image).attrs({
  contentFit: 'cover',
})`
  width: 300px;
  height: 300px;
  transform: scale(1.3);
`;

export const FloatingBall = styled.View`
  background-color: #fff;
  border-radius: 22px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 5;
`;

export const TitleWrapper = styled.View`
  align-items: center;
  margin-bottom: 12px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-family: 'Poppins_700Bold';
  color: #41245C;
`;

export const HighlightedTitle = styled.Text`
  font-size: 28px;
  font-family: 'Poppins_700Bold';
  color: #EBA059;
`;

export const Title2 = styled.Text`
  font-size: 28px;
  font-family: 'Poppins_700Bold';
  color: #41245C;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: #7C7C7C;
  text-align: center;
  font-family: 'Poppins_400Regular';
  margin-bottom: 10px;
  padding: 0 30px;
`;

export const ButtonSignIN = styled.TouchableOpacity`
  background-color: #41245C;
  margin: 8px;
  height: 50px;
  border-radius: 25px;
  width: 85%;
  justify-content: center;
  align-items: center;
`;

export const ButtonSignUP = styled.TouchableOpacity`
  background-color: #fff;
  border: 2px solid #41245C;
  margin: 8px;
  height: 50px;
  border-radius: 25px;
  width: 85%;
  justify-content: center;
  align-items: center;
`;

export const ButtonTextSignIN = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_400Regular';
`;

export const ButtonTextSignUP = styled.Text`
  color: #41245C;
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_400Regular';
`;

export const SmallText = styled.Text`
  font-size: 14px;
  color: #7C7C7C;
  margin: 6px 0;
  font-family: 'Poppins_400Regular';
`;

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

export const TitleWrapper = styled.View`
  align-items: center; /* Center the text horizontally */
  margin-bottom: 10px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-family: 'Poppins_700Bold';
  color: #000;
`;

export const HighlightedTitle = styled.Text`
  font-size: 32px;
  font-family: 'Poppins_700Bold';
  color: #EBA059;
`;

export const Title2 = styled.Text`
  font-size: 32px;
  font-family: 'Poppins_700Bold';
  color: #000;
`;

export const StyledImage = styled.Image`
  width: 350px;
  height: 300px;
  margin-bottom: 60px;
`;

export const ButtonSignIN = styled.TouchableOpacity`
  background-color: #41245C;
  margin: 10px;
  height: 50px;
  border-radius: 20px;
  width: 250px;
  justify-content: center;
  align-items: center;
`;

export const ButtonSignUP = styled.TouchableOpacity`
  background-color: #41245C;
  margin: 10px;
  height: 50px;
  border-radius: 20px;
  width: 250px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_400Regular';
`;

export const SmallText = styled.Text`
  font-size: 14px;
  color: #333;
  margin: 10px 0;
  font-family: 'Poppins_400Regular';
`;
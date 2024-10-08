import styled from 'styled-components/native';


export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const AlertContainer = styled.View`
  width: 80%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 10;
`;

export const AlertIcon = styled.View`
  margin-bottom: 10px;
`;

export const AlertTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

export const AlertMessage = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

export const AlertButton = styled.TouchableOpacity`
  background-color: #D81E5B;
  padding: 10px 20px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

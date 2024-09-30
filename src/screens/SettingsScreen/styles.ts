import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 15px 20px;
  border-radius: 10px;
  margin-vertical: 10px;
  width: 100%; /* Faz o botão ocupar a largura da tela */
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

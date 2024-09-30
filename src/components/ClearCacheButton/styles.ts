import styled from 'styled-components/native';

// Estilo para o container do botão
export const ButtonContainer = styled.TouchableOpacity`
  background-color: #4caf50;
  padding: 15px 20px;
  border-radius: 10px;
  margin-vertical: 10px;
  width: 100%; /* Faz o botão ocupar a largura da tela */
  align-items: center;
`;

// Estilo para o texto do botão
export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

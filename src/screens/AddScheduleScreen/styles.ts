import styled from 'styled-components/native';

// Container principal que envolve a tela
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

// Estilo para o botão "Adicionar Compromisso"
export const AddButton = styled.TouchableOpacity`
  background-color: #7289da;  /* Cor semelhante ao Discord */
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
`;

// Texto dentro dos botões
export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

// Estilo de cada item da lista de compromissos
export const ListItem = styled.View`
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

// Texto dentro de cada item da lista
export const ListItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

// Input de texto para a descrição dos compromissos
export const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #ccc;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
`;

import styled from 'styled-components/native';

// Container principal para a tela
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  justify-content: center;
`;

// Título principal da tela
export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

// Input estilizado para os campos de texto
export const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #fff;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #7289DA;
  width: 100%; 
  height: 40px; // Increase the height for a bigger button
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  align-self: center; // Center the button horizontally in its container
`;
// Texto dentro do botão
export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

// Estilo para a imagem de pré-visualização
export const ImagePreview = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-top: 20px;
  align-self: center;
  border-width: 1px;
  border-color: #ddd;
`;

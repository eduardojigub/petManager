import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 30px 20px;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #41245C;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Poppins_700Bold';
`;

export const Button = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 12px;
  margin-vertical: 12px;
  width: 100%;
  max-width: 350px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Poppins_600SemiBold';
`;

/* Modal styling */
export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
  width: 90%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
`;

export const ModalText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
  text-align: left;
  line-height: 22px;
`;

export const ScrollContainer = styled.ScrollView`
  max-height: 300px;
  width: 100%;
  padding: 10px;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #7289DA;
  border-radius: 5px;
`;

export const CloseButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

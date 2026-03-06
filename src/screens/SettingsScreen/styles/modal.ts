import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
  width: 90%;
  padding: 28px 24px;
  background-color: #fff;
  border-radius: 20px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  color: #41245c;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Poppins_700Bold';
`;

export const ModalText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-align: left;
  line-height: 22px;
  font-family: 'Poppins_400Regular';
`;

export const SectionTitle = styled.Text`
  font-size: 14px;
  color: #41245c;
  font-family: 'Poppins_600SemiBold';
  margin-top: 8px;
  margin-bottom: 4px;
`;

export const ScrollModalContent = styled.ScrollView`
  max-height: 380px;
  width: 100%;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 12px 32px;
  background-color: #7289da;
  border-radius: 12px;
`;

export const CloseButtonText = styled.Text`
  color: #fff;
  font-family: 'Poppins_600SemiBold';
  font-size: 15px;
`;

export const ModalOptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  background-color: #f8f8f8;
  margin-bottom: 10px;
`;

export const ModalOptionText = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
  margin-left: 12px;
  flex: 1;
`;

export const ModalOptionCheck = styled.Text`
  font-size: 18px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

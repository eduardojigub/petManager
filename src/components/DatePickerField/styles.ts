import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const ActionText = styled.Text`
  color: #7289DA;
  font-size: 16px;
`;

import styled from 'styled-components/native';

interface ListItemProps {
  isPast: boolean;
}

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;



export const ListItem = styled.View<ListItemProps>`
  background-color: ${({ isPast }) => (isPast ? 'rgba(128, 128, 128, 0.2)' : '#ffffff')};
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const ListItemText = styled.Text<{ isPast: boolean }>`
  font-size: 16px;
  color: ${({ isPast }) => (isPast ? '#A9A9A9' : '#41245C')};
  flex-shrink: 1;
`;

export const ListItemContent = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

export const TrashIconContainer = styled.TouchableOpacity`
  margin-left: 10px;
`;

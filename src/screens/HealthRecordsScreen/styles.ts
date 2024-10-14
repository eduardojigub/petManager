import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const ListItemContent = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const ListItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const TypeIcon = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

export const ListItemDetailHint = styled.Text`
  color: #7289DA;
  font-size: 12px;
  margin-top: 4px;
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

export const TrashIconContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-left: auto;
`;

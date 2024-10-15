import { Platform } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${Platform.OS === 'ios' ? '#ffffff' : '#ededed '};
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

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
`;

export const FilterButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
  width: 100%;
`;

export const DetailDateText = styled.Text`
  color: #A9A9A9;
  font-size: 12px;
`;

export const EmptyListContainer = styled.View`
  align-items: center;
  margin-top: 80px;
`;

export const EmptyListImage = styled.Image`
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
`;

export const EmptyListText = styled.Text`
  font-size: 16px;
  color: #000;
  text-align: center;
  margin-horizontal: 20px;
  margin-top: 30px;
  font-family: 'Poppins_400Regular';
`;

export const DisabledAddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
  opacity: 0.5; // Reduced opacity for disabled effect
`;
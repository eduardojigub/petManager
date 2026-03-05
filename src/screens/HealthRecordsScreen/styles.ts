import { Platform } from 'react-native';
import styled from 'styled-components/native';
export { ListItemDetailHint } from '../../styles/shared';

export const Container = styled.View`
  flex: 1;
  padding: 10px;
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

export const AddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
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

export const DetailDateText = styled.Text`
  color: #A9A9A9;
  font-size: 12px;
`;

export const DisabledAddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
  opacity: 0.5;
`;

export const FloatingFilterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 90px;
  right: 25px;
  background-color: #41245C;
  padding: 15px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

export const FloatingClearFilterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 150px;
  right: 25px;
  background-color: #E07A73;
  padding: 15px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

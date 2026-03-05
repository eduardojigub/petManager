import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

export const SharedButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

export const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const ListItemDetailHint = styled.Text`
  color: #7289DA;
  font-size: 12px;
  margin-top: 4px;
`;

export const TypeSelector = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const TypeOption = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: ${({ selected }) => (selected ? '#41245C' : '#f5f5f5')};
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  flex-basis: 48%;
  justify-content: center;
`;

export const TypeText = styled.Text<{ selected?: boolean }>`
  margin-left: 8px;
  color: ${({ selected }) => (selected ? '#fff' : '#666')};
  font-weight: bold;
`;

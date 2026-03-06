import styled from 'styled-components/native';
import { Image } from 'react-native';

export const DogChipsRow = styled.View`
  margin-bottom: 20px;
`;

export const DogChip = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ selected }) => (selected ? '#fff' : '#f0eff4')};
  padding: 8px 16px;
  border-radius: 24px;
  margin-right: 10px;
  border-width: ${({ selected }) => (selected ? '2px' : '0px')};
  border-color: ${({ selected }) => (selected ? '#41245c' : 'transparent')};
`;

export const DogChipImage = styled(Image)`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-right: 8px;
`;

export const DogChipPlaceholder = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const DogChipPlaceholderText = styled.Text`
  font-size: 12px;
  color: #41245c;
  font-family: 'Poppins_600SemiBold';
`;

export const DogChipText = styled.Text<{ selected?: boolean }>`
  font-size: 14px;
  color: ${({ selected }) => (selected ? '#41245c' : '#333')};
  font-family: ${({ selected }) =>
    selected ? 'Poppins_700Bold' : 'Poppins_600SemiBold'};
`;

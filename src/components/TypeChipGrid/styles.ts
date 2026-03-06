import styled from 'styled-components/native';

export const TypeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

export const TypeChip = styled.TouchableOpacity<{
  selected?: boolean;
  selectedBg?: string;
}>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-radius: 14px;
  background-color: ${({ selected, selectedBg }) =>
    selected ? selectedBg || '#41245c' : '#fff'};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 1;
`;

export const TypeChipText = styled.Text<{
  selected?: boolean;
  selectedColor?: string;
}>`
  font-size: 14px;
  color: ${({ selected, selectedColor }) =>
    selected ? selectedColor || '#fff' : '#666'};
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;

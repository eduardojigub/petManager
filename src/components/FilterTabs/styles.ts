import styled from 'styled-components/native';

export const FilterTabsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const FilterTabsRow = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const ScrollHint = styled.View`
  padding-left: 4px;
  justify-content: center;
  align-items: center;
`;

export const FilterTab = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 10px 20px;
  border-radius: 24px;
  margin-right: 10px;
  background-color: ${({ selected }) => (selected ? '#41245c' : 'transparent')};
`;

export const FilterTabText = styled.Text<{ selected?: boolean }>`
  font-size: 14px;
  color: ${({ selected }) => (selected ? '#fff' : '#999')};
  font-family: 'Poppins_600SemiBold';
`;

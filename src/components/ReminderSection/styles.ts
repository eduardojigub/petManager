import styled from 'styled-components/native';

export const ReminderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const ReminderLabel = styled.Text`
  font-size: 14px;
  color: #333;
  font-family: 'Poppins_500Medium';
  flex: 1;
  margin-left: 10px;
`;

export const ReminderChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const ReminderChip = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${({ selected }) => (selected ? '#41245c' : '#f8f8f8')};
`;

export const ReminderChipText = styled.Text<{ selected?: boolean }>`
  font-size: 13px;
  color: ${({ selected }) => (selected ? '#fff' : '#666')};
  font-family: 'Poppins_500Medium';
`;

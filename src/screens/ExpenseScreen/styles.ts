import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #ffff;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #41245C;
`;

export const ExpenseItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const ExpenseItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const ExpenseIconContainer = styled.View`
  margin-right: 10px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

export const ExpenseDateText = styled.Text`
  color: #A9A9A9;
  font-size: 12px;
`;

export const ListItemDetailHint = styled.Text`
  color: #7289DA;
  font-size: 12px;
  margin-top: 4px;
`;

export const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #41245C;
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
  padding: 10px`;

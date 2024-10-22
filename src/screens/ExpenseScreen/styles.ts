import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #ffff;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #41245C;
`;

export const ExpenseItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
`;

export const ExpenseItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const ExpenseIconContainer = styled.View`
  margin-right: 10px;
`;

export const ExpenseDateText = styled.Text`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

export const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #41245C;
`;

export const AddButton = styled.TouchableOpacity`
  background-color:  #41245C;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

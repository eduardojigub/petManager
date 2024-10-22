import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #41245C;
`;

export const CustomButton = styled.TouchableOpacity`
  background-color: #41245C;
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

export const ExpenseItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
`;

export const ExpenseItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #41245C;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #41245C;
  text-align: right;
  margin-top: 20px;
`;

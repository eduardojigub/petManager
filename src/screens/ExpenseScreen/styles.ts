import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
export { ListItemDetailHint } from '../../styles/shared';

export const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: #ffff;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #41245c;
  text-align: center;
  flex: 1;
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
  color: #a9a9a9;
  font-size: 12px;
`;


export const TotalText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #41245c;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #41245c;
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
`;

export const MonthSelectorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between; /* Ensures buttons are on each side */
  padding-horizontal: 20px;
`;
export const MonthButton = styled.TouchableOpacity``;

export const ExpenseItemContent = styled.View`
  flex: 1;
`;

export const ExpenseAmountText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: bold;
`;

export const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 30px;
`;

export const YearTotalText = styled.Text`
  color: #a9a9a9;
  font-size: 16px;
  padding-top: 20px;
`;

export const FadeDivider = styled(LinearGradient).attrs({
  colors: ['transparent', 'rgba(0,0,0,0.1)'],
})`
  height: 10px;
`;

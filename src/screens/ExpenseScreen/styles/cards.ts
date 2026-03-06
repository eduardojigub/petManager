import styled from 'styled-components/native';

// Stats
export const StatsCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px 8px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
  elevation: 1;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const StatCard = styled.View`
  flex: 1;
  align-items: center;
  padding: 4px;
`;

export const StatValue = styled.Text<{ color?: string }>`
  font-size: 18px;
  color: ${({ color }) => color || '#333'};
  font-family: 'Poppins_700Bold';
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  text-align: center;
`;

// Total row
export const TotalRow = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
  elevation: 1;
`;

export const TotalLabel = styled.Text`
  font-size: 13px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

export const TotalValue = styled.Text`
  font-size: 22px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

export const YearTotalValue = styled.Text`
  font-size: 14px;
  color: #999;
  font-family: 'Poppins_600SemiBold';
`;

// Expense card
export const ExpenseCard = styled.TouchableOpacity<{ borderColor?: string }>`
  flex-direction: row;
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: ${({ borderColor }) => borderColor || '#41245c'};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
  elevation: 1;
`;

export const ExpenseIconContainer = styled.View<{ bgColor?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const ExpenseContent = styled.View`
  flex: 1;
`;

export const ExpenseTitle = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const ExpenseSubtitle = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const ExpenseRight = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

export const ExpenseAmount = styled.Text`
  font-size: 15px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

export const ExpenseDate = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const RecurringBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0eff4;
  padding: 2px 8px;
  border-radius: 8px;
  margin-top: 4px;
`;

export const RecurringBadgeText = styled.Text`
  font-size: 10px;
  color: #41245c;
  font-family: 'Poppins_600SemiBold';
  margin-left: 4px;
`;

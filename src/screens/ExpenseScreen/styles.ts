import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const Container = styled.View`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
  padding-top: 50px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`;

export const HeaderTitle = styled.Text`
  font-size: 26px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

export const HeaderSubtitle = styled.Text`
  font-size: 13px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-bottom: 20px;
`;

// Dog chips
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
  font-family: ${({ selected }) => (selected ? 'Poppins_700Bold' : 'Poppins_600SemiBold')};
`;

// Month selector wrapper
export const MonthSelectorWrapper = styled.View`
  margin-bottom: 20px;
`;

// Stats card
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

// Filter tabs
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

// Recurring badge
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

// Add button
export const AddButton = styled.TouchableOpacity`
  background-color: #41245c;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 20px;
`;

export const AddButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
`;

export const SwipeDeleteButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  justify-content: center;
  align-items: center;
  width: 80px;
  border-radius: 16px;
  margin-bottom: 12px;
  margin-left: 8px;
`;

export const DeleteAllButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 4px 0;
`;

export const DeleteAllButtonText = styled.Text`
  color: #e74c3c;
  font-size: 13px;
  font-family: 'Poppins_500Medium';
`;

export const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 60px;
`;

export const EmptyImage = styled.Image`
  width: 280px;
  height: 280px;
  margin-bottom: 24px;
  border-radius: 24px;
  background-color: #fff;
`;

export const EmptyText = styled.Text`
  font-size: 20px;
  color: #666;
  font-family: 'Poppins_700Bold';
  text-align: center;
`;

export const EmptySubtext = styled.Text`
  font-size: 15px;
  color: #aaa;
  font-family: 'Poppins_400Regular';
  text-align: center;
  margin-top: 6px;
`;

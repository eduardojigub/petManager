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

// Filter tabs
export const FilterTabsRow = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
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

// Schedule card
export const ScheduleCard = styled.TouchableOpacity<{ borderColor?: string; isPast?: boolean }>`
  flex-direction: row;
  background-color: ${({ isPast }) => (isPast ? '#fafafa' : '#fff')};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  border-left-color: ${({ borderColor, isPast }) => (isPast ? '#ccc' : borderColor || '#41245c')};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
  elevation: 1;
  opacity: ${({ isPast }) => (isPast ? 0.6 : 1)};
`;

export const ScheduleIconContainer = styled.View<{ bgColor?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const ScheduleContent = styled.View`
  flex: 1;
`;

export const ScheduleTitle = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const ScheduleSubtitle = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const ScheduleRight = styled.View`
  align-items: flex-end;
  justify-content: space-between;
`;

export const ScheduleDate = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_600SemiBold';
`;

export const ScheduleTime = styled.Text`
  font-size: 11px;
  color: #888;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const ScheduleBadge = styled.View<{ bgColor?: string }>`
  padding: 3px 10px;
  border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor || '#e0f5e9'};
  margin-top: 6px;
`;

export const ScheduleBadgeText = styled.Text<{ color?: string }>`
  font-size: 11px;
  color: ${({ color }) => color || '#27ae60'};
  font-family: 'Poppins_600SemiBold';
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

export const DeleteAllButton = styled.TouchableOpacity`
  padding: 4px 0;
`;

export const DeleteAllButtonText = styled.Text`
  color: #e74c3c;
  font-size: 13px;
  font-family: 'Poppins_500Medium';
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

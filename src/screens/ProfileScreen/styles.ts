import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
  padding-top: 50px;
`;

// Top card
export const TopCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

// Header
export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const GreetingText = styled.Text`
  font-size: 26px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

export const GreetingSubtext = styled.Text`
  font-size: 14px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

export const UserAvatar = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #41245c;
  align-items: center;
  justify-content: center;
`;

export const UserAvatarImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
`;

export const UserAvatarText = styled.Text`
  font-size: 18px;
  color: #fff;
  font-family: 'Poppins_700Bold';
`;

// Your Dogs section
export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #333;
  font-family: 'Poppins_700Bold';
  margin-bottom: 12px;
`;

export const DogChipsRow = styled.View`
  flex-direction: row;
  margin-bottom: 0px;
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

export const AddDogChip = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 4px;
  elevation: 1;
`;

// Dog Detail Card
export const DogDetailCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const DogDetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const DogDetailImage = styled(Image)`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  border-width: 2px;
  border-color: #41245c;
`;

export const DogDetailPlaceholder = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #e0dce6;
`;

export const DogDetailInfo = styled.View`
  flex: 1;
  margin-left: 16px;
`;

export const DogDetailName = styled.Text`
  font-size: 20px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const DogDetailBreed = styled.Text`
  font-size: 13px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

export const DogDetailMeta = styled.Text`
  font-size: 13px;
  color: #888;
  font-family: 'Poppins_400Regular';
`;

export const EditDogButton = styled.TouchableOpacity`
  padding: 4px;
`;

// Stats Row
export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const StatCard = styled.TouchableOpacity<{ bgColor?: string }>`
  flex: 1;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  border-radius: 14px;
  padding: 12px;
  margin-horizontal: 4px;
  align-items: center;
`;

export const StatValue = styled.Text<{ color?: string }>`
  font-size: 20px;
  color: ${({ color }) => color || '#333'};
  font-family: 'Poppins_700Bold';
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  color: #666;
  font-family: 'Poppins_400Regular';
  text-align: center;
`;

// Quick Actions
export const QuickActionsTitle = styled.Text`
  font-size: 16px;
  color: #333;
  font-family: 'Poppins_700Bold';
  margin-bottom: 12px;
  margin-top: 20px;
`;

export const QuickActionButton = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 14px;
  margin-bottom: 10px;
`;

export const QuickActionText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;

// Recent Activity
export const RecentActivityCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const RecentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const RecentTitle = styled.Text`
  font-size: 18px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const ViewAllText = styled.Text`
  font-size: 13px;
  color: #7289da;
  font-family: 'Poppins_600SemiBold';
`;

export const ActivityItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 14px;
`;

export const ActivityIconContainer = styled.View<{ bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const ActivityInfo = styled.View`
  flex: 1;
`;

export const ActivityTitle = styled.Text`
  font-size: 14px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
`;

export const ActivityTime = styled.Text`
  font-size: 12px;
  color: #888;
  font-family: 'Poppins_400Regular';
`;

// Empty states
export const NoDogsContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

export const NoDogsText = styled.Text`
  font-size: 16px;
  color: #41245c;
  font-family: 'Poppins_400Regular';
  margin-top: 10px;
  text-align: center;
`;

export const AddProfileCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #aaa;
  font-family: 'Poppins_400Regular';
  text-align: center;
  margin-top: 12px;
`;

export const ScheduleLoadingIndicator = styled.ActivityIndicator.attrs({
  size: 'large',
  color: '#41245C',
})`
  margin-vertical: 20px;
`;

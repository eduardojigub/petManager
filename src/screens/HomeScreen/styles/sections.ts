import styled from 'styled-components/native';

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

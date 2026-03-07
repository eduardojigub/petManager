import styled from 'styled-components/native';

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
  font-size: 22px;
  color: ${({ color }) => color || '#333'};
  font-family: 'Poppins_700Bold';
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  text-align: center;
`;

// Record card
export const RecordCard = styled.TouchableOpacity<{ borderColor?: string }>`
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

export const RecordIconContainer = styled.View<{ bgColor?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const RecordContent = styled.View`
  flex: 1;
`;

export const RecordTitle = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const RecordSubtitle = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const RecordRight = styled.View`
  align-items: flex-end;
  justify-content: space-between;
`;

export const RecordDate = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

export const RecordTime = styled.Text`
  font-size: 11px;
  color: #7289da;
  font-family: 'Poppins_500Medium';
  margin-top: 2px;
`;

export const RecordBadge = styled.View<{ bgColor?: string }>`
  padding: 3px 10px;
  border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor || '#e0f5e9'};
  margin-top: 6px;
`;

export const RecordBadgeText = styled.Text<{ color?: string }>`
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
  margin-top: 8px;
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
  margin-bottom: 20px;
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

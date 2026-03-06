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

export const MonthSelectorWrapper = styled.View`
  margin-bottom: 20px;
`;

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

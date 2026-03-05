import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 10px;
`;

export const ArrowButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const MonthTitle = styled.Text`
  font-size: 18px;
  font-family: Poppins_600SemiBold;
  color: #41245C;
`;

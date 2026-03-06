import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  padding: 12px 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
  elevation: 1;
`;

export const ArrowButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
`;

export const MonthTitle = styled.Text`
  font-size: 16px;
  font-family: 'Poppins_700Bold';
  color: #41245c;
`;

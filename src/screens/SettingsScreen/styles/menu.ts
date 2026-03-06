import styled from 'styled-components/native';

export const MenuCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 4px 0;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
`;

export const MenuIconContainer = styled.View<{ bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
`;

export const MenuTextContainer = styled.View`
  flex: 1;
  margin-left: 14px;
`;

export const MenuItemTitle = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
`;

export const MenuItemSubtitle = styled.Text`
  font-size: 12px;
  color: #999;
  font-family: 'Poppins_400Regular';
`;

export const MenuDivider = styled.View`
  height: 1px;
  background-color: #f0f0f0;
  margin-left: 74px;
`;

export const LogoutTitle = styled.Text`
  font-size: 15px;
  color: #e74c3c;
  font-family: 'Poppins_600SemiBold';
`;

export const LogoutSubtitle = styled.Text`
  font-size: 12px;
  color: #e74c3c;
  opacity: 0.7;
  font-family: 'Poppins_400Regular';
`;

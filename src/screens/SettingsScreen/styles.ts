import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
  padding-top: 50px;
`;

export const HeaderTitle = styled.Text`
  font-size: 28px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

export const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: #999;
  font-family: 'Poppins_400Regular';
  margin-bottom: 24px;
`;

export const ProfileCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const ProfileAvatar = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #41245c;
  align-items: center;
  justify-content: center;
`;

export const ProfileAvatarText = styled.Text`
  font-size: 22px;
  color: #fff;
  font-family: 'Poppins_700Bold';
`;

export const ProfileAvatarImage = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const ProfileInfo = styled.View`
  flex: 1;
  margin-left: 14px;
`;

export const ProfileName = styled.Text`
  font-size: 16px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
`;

export const ProfileEmail = styled.Text`
  font-size: 13px;
  color: #999;
  font-family: 'Poppins_400Regular';
`;

export const EditButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
`;

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

export const FooterText = styled.Text`
  font-size: 13px;
  color: #bbb;
  text-align: center;
  font-family: 'Poppins_400Regular';
  margin-top: 8px;
`;

export const FooterSubtext = styled.Text`
  font-size: 12px;
  color: #ccc;
  text-align: center;
  font-family: 'Poppins_400Regular';
  margin-bottom: 32px;
`;

/* Modal styling */
export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
  width: 90%;
  padding: 28px 24px;
  background-color: #fff;
  border-radius: 20px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  color: #41245c;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Poppins_700Bold';
`;

export const ModalText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-align: left;
  line-height: 22px;
  font-family: 'Poppins_400Regular';
`;

export const SectionTitle = styled.Text`
  font-size: 14px;
  color: #41245c;
  font-family: 'Poppins_600SemiBold';
  margin-top: 8px;
  margin-bottom: 4px;
`;

export const ScrollModalContent = styled.ScrollView`
  max-height: 380px;
  width: 100%;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 12px 32px;
  background-color: #7289da;
  border-radius: 12px;
`;

export const CloseButtonText = styled.Text`
  color: #fff;
  font-family: 'Poppins_600SemiBold';
  font-size: 15px;
`;

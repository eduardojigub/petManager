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

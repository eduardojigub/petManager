import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
  padding-top: 50px;
`;

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

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #333;
  font-family: 'Poppins_700Bold';
  margin-bottom: 12px;
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

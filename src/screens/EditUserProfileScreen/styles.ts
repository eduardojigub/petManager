import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f8f8f8;
  padding: 20px;
`;

export const AvatarContainer = styled.TouchableOpacity`
  align-self: center;
  margin-bottom: 32px;
  margin-top: 12px;
`;

export const AvatarImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

export const AvatarPlaceholder = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #41245c;
  align-items: center;
  justify-content: center;
`;

export const AvatarPlaceholderText = styled.Text`
  font-size: 40px;
  color: #fff;
  font-family: 'Poppins_700Bold';
`;

export const CameraIconContainer = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #7289da;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #f8f8f8;
`;

export const Label = styled.Text`
  font-size: 13px;
  color: #999;
  font-family: 'Poppins_500Medium';
  margin-bottom: 6px;
  margin-left: 4px;
`;

export const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const EmailText = styled.Text`
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: #999;
  font-family: 'Poppins_400Regular';
  margin-bottom: 20px;
`;

export const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#7289da')};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 12px;
`;

export const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Poppins_600SemiBold';
`;

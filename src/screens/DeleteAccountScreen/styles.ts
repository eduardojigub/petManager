import styled from 'styled-components/native';

export const Container = styled.View`
  flex-grow: 1;
  background-color: #f8f8f8;
`;

export const Content = styled.View`
  padding: 20px;
  padding-bottom: 40px;
`;

export const WarningCard = styled.View`
  background-color: #fde8e8;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
`;

export const WarningIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const WarningTitle = styled.Text`
  font-size: 18px;
  color: #c0392b;
  font-family: 'Poppins_700Bold';
  margin-bottom: 8px;
`;

export const WarningBody = styled.Text`
  font-size: 14px;
  line-height: 21px;
  color: #333;
  font-family: 'Poppins_400Regular';
`;

export const Card = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const ListTitle = styled.Text`
  font-size: 13px;
  color: #999;
  font-family: 'Poppins_500Medium';
  margin-bottom: 10px;
`;

export const BulletRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const Bullet = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #e74c3c;
  margin-top: 7px;
  margin-right: 10px;
`;

export const BulletText = styled.Text`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  font-family: 'Poppins_400Regular';
`;

export const AfterText = styled.Text`
  font-size: 13px;
  line-height: 20px;
  color: #666;
  font-family: 'Poppins_400Regular';
  margin-bottom: 20px;
`;

export const Label = styled.Text`
  font-size: 13px;
  color: #999;
  font-family: 'Poppins_500Medium';
  margin-bottom: 6px;
  margin-left: 4px;
`;

export const InputWrap = styled.View`
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: #fff;
  border-radius: 12px;
  padding: 14px 48px 14px 16px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const TogglePasswordIcon = styled.TouchableOpacity`
  position: absolute;
  right: 14px;
  top: 14px;
`;

export const Hint = styled.Text`
  font-size: 12px;
  line-height: 18px;
  color: #999;
  font-family: 'Poppins_400Regular';
  margin-bottom: 16px;
  margin-left: 4px;
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: #e74c3c;
  font-family: 'Poppins_500Medium';
  text-align: center;
  margin-bottom: 16px;
`;

export const DeleteButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#f5b7b1' : '#e74c3c')};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 4px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const DeleteButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-family: 'Poppins_600SemiBold';
`;

export const LoadingText = styled(DeleteButtonText)`
  margin-left: 8px;
`;

export const CancelButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 16px;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

export const CancelButtonText = styled.Text`
  color: #41245c;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
`;

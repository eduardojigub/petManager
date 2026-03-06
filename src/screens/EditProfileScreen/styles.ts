import styled from 'styled-components/native';

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

export const AvatarContainer = styled.TouchableOpacity`
  margin-top: 12px;
  margin-bottom: 28px;
`;

export const AvatarImage = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  border-width: 3px;
  border-color: #41245c;
`;

export const AvatarPlaceholder = styled.View`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #e0dce6;
`;

export const CameraIconBadge = styled.View`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #7289da;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #f8f8f8;
`;

export const FormCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
  margin-bottom: 20px;
`;

export const FormTitle = styled.Text`
  font-size: 18px;
  color: #333;
  font-family: 'Poppins_700Bold';
  text-align: center;
  margin-bottom: 20px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const InputLabel = styled.Text`
  font-size: 12px;
  color: #999;
  font-family: 'Poppins_500Medium';
  margin-bottom: 6px;
  margin-left: 4px;
`;

export const InputWithIcon = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const IconInput = styled.TextInput`
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
`;

export const UnitText = styled.Text`
  font-size: 14px;
  color: #999;
  font-family: 'Poppins_400Regular';
  margin-left: 8px;
`;

export const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#41245c')};
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 12px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'Poppins_600SemiBold';
`;

export const GenderRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const GenderChip = styled.TouchableOpacity<{ selected?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) => (selected ? '#41245c' : '#f8f8f8')};
  padding: 14px;
  border-radius: 14px;
`;

export const GenderChipText = styled.Text<{ selected?: boolean }>`
  font-size: 14px;
  color: ${({ selected }) => (selected ? '#fff' : '#999')};
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;

export const DatePickerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 14px;
  padding: 14px 16px;
`;

export const DatePickerText = styled.Text<{ hasValue?: boolean }>`
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
  color: ${({ hasValue }) => (hasValue ? '#333' : '#ccc')};
  font-family: 'Poppins_400Regular';
`;

export const AgeDisplay = styled.Text`
  font-size: 13px;
  color: #7289da;
  font-family: 'Poppins_500Medium';
  margin-top: 6px;
  margin-left: 4px;
`;

export const OptionalBadge = styled.Text`
  font-size: 11px;
  color: #ccc;
  font-family: 'Poppins_400Regular';
  margin-left: 4px;
`;

export const DeleteButton = styled.TouchableOpacity`
  width: 100%;
  background-color: #e74c3c;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
`;

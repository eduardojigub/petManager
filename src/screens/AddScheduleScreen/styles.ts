import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

export const StyledTextInput = styled.TextInput.attrs({
  placeholderTextColor: '#888',
  multiline: true,
  textAlignVertical: 'top',
})`
  width: 100%;
  min-height: 100px;
  padding: 15px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #ddd;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;


export const DatePickerButton = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 12px 15px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #ddd;
  margin-bottom: 15px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const DatePickerText = styled.Text`
  font-size: 16px;
  color: #41245C;
  margin-left: 15px;
`;

export const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

export const CheckboxRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 20px;
`;

export const CheckboxText = styled.Text`
  font-size: 16px;
  color: #41245C;
  margin-left: 10px;
`;

export const TypeOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? '#7289DA' : '#ddd')};
  background-color: ${({ selected }) => (selected ? 'rgba(114,137,218,0.2)' : '#ffffff')};
`;

export const TypeOptionText = styled.Text`
  font-size: 14px;
  color: #41245C;
  margin-left: 5px;
`;

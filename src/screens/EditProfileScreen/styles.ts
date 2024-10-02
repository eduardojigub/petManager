import styled from 'styled-components/native';

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #f0f2f5;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
`;

export const Label = styled.Text`
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const Input = styled.TextInput`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const AddPhotoButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 12px 20px;
  border-radius: 25px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 15px 30px;
  border-radius: 25px;
  width: 100%;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

export const ImagePreview = styled.Image`
  width: 200px;
  height: 200px;
  margin-top: 20px;
  border-radius: 100px;
  border: 2px solid #7289DA;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

export const NoImageText = styled.Text`
  color: #888;
  font-size: 16px;
  margin-top: 20px;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #e74c3c; /* Red color for delete */
  padding: 15px 30px;
  border-radius: 25px;
  margin-top: 20px;
  width: 100%;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

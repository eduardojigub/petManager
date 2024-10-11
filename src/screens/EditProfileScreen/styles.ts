import styled from 'styled-components/native';

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

export const BannerImageBackground = styled.ImageBackground`
  width: 100%;
  height: 250px;
  justify-content: flex-end;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
  background-color: #e0e0e0; // Placeholder color if no image is available
`;

export const FormContainer = styled.View`
  margin-top: -40px; // Pull up the form container to overlay slightly on the banner
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Container = styled.View`
  justify-content: center;
  align-items: center;
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
`;

export const AddPhotoButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 12px 20px;
  border-radius: 25px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 15px 30px;
  border-radius: 25px;
  width: 100%;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const NoImageText = styled.Text`
  color: #888;
  font-size: 16px;
  text-align: center;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 15px 30px;
  border-radius: 25px;
  margin-top: 20px;
  width: 100%;
  align-items: center;
`;

import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
  padding: 10px;
`;

export const Header = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 15px;
`;

export const ProfileList = styled.View`
  height: 120px;
  margin-bottom: 20px;
`;

export const ProfileItem = styled.TouchableOpacity`
  margin-right: 15px;
  align-items: center;
`;

export const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin-bottom: 5px;
`;

export const ProfileName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export const SelectedDogSection = styled.View`
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

export const DogDetails = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

export const DogImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 10px;
  border-width: 2px;
  border-color: #7289DA;
`;

export const EditButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 10px 20px;
  border-radius: 30px;
`;

export const EditButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

export const NotesSection = styled.View`
  margin-top: 20px;
`;

export const NotesTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const NoteItem = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
`;

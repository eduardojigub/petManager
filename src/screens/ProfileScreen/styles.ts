import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  flex: 1;
  background-color: #ffff;
  padding: 10px;
`;


export const Header = styled.View`
  width: 100%;
  margin-bottom: 15px;
`;

export const WelcomeHeader = styled.Text`
  font-size: 24px;
  font-family: 'Poppins_600SemiBold';
  color: #333;
  align-self: flex-start; // Aligns the text to the left within the Header
  margin-left: 10px; // Optional: Add a slight margin for consistent padding
`;

export const ProfileList = styled.View`
  height: 120px;
  margin-bottom: 20px;
`;

export const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-bottom: 5px;
  border-width: 1px;
  border-color: #000;
  margin-top: 10px;
`;

export const AddProfileCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px; // Circular shape
  background-color: #000;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  margin-left: 10px;
  margin-top: 10px;
`;


export const ProfileItem = styled.TouchableOpacity`
  margin-right: 15px;
  align-items: center;
`;

export const ProfileName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;



export const SelectedDogSection = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden; // Ensures the image and gradient fit within the card
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
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

export const DogImageBackground = styled.ImageBackground`
  width: 100%;
  height: 180px;
  justify-content: flex-end; // Align items to the bottom
`;

export const GradientOverlay = styled(LinearGradient).attrs({
  colors: ['transparent', 'rgba(0, 0, 0, 0.6)'],
})`
  width: 100%;
  padding: 10px;
  padding-bottom: 15px;
`;

export const DogDetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const EditButton = styled.TouchableOpacity`
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 20px;
  margin-right: 10px;
`;

export const EditButtonText = styled.Text`
  color: #000;
  font-size: 14px;
  font-family: 'Poppins_600SemiBold';
`;

export const DogInfoText = styled.Text`
  color: white;
  font-size: 14px;
  font-family: 'Poppins_400Regular';
`;

export const DogInfo = styled.View`
  padding-left: 10px;
`;


export const NotesHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px; // Optional: Add slight padding for spacing from the right edge
`;
export const NotesTitle = styled.Text`
 font-size: 20px;
  font-weight: normal;
  font-family: 'Poppins_600SemiBold';
  color: #333;
  align-self: flex-start; // Aligns the text to the left within the Header
  margin-left: 10px; // Optional: Add a slight margin for consistent padding
`;

export const NoteItem = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
`;

export const MoreButtonText = styled.Text`
  color: #666666;
  font-size: 14px;
  font-family: 'Poppins_400Regular';
`;

export const NotesSection = styled.View`
  margin-top: 20px;
`;

export const NoAppointmentText = styled.Text`
  margin-top: 12px;
`

export const NoteItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

export const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #eee;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const DescriptionContainer = styled.View`
  flex: 1;
`;

export const DescriptionText = styled.Text`
  font-size: 16px;
  font-family: 'Poppins_400Regular';
  color: #333;
`;

export const SubtitleText = styled.Text`
  font-size: 14px;
  color: #666666;
  font-family: 'Poppins_400Regular';
`;

export const DetailsButton = styled.TouchableOpacity`
  background-color: #FA6650;
  padding: 8px 12px;
  border-radius: 5px;
`;

export const DetailsButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-family: 'Poppins_600SemiBold';
`;
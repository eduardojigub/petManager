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
  border-width: 1px;
  border-color: #41245C;
  margin-top: 10px;
`;

export const AddProfileCircle = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const ProfilePlaceholder = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #DFC2FA; /* Placeholder background color */
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: #41245C;
  margin-top: 10px;
`;


export const ProfileItem = styled.TouchableOpacity`
  margin-right: 15px;
  align-items: center;
`;

export const ProfileName = styled.Text`
  font-size: 14px;
  font-family: 'Poppins_400Regular';
  color: #666666;
  margin-top: 5px;
`;


export const SelectedDogSection = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
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
  border-color: #41245C;
`;

export const DogImageBackground = styled.ImageBackground`
  width: 100%;
  height: 220px;
  justify-content: flex-end;
  position: relative;
`;

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Overlay with slight opacity */
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
  margin-top: 30px;
`;

export const EditButtonText = styled.Text`
  color: #000;
  font-size: 14px;
  font-family: 'Poppins_600SemiBold';
`;

export const DogInfoText = styled.Text`
  color: white;
  font-size: 14px;
  font-family: 'Poppins_500Medium';
`;

export const DogInfo = styled.View`
  padding-left: 10px;
`;

export const DogInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const InfoText = styled.Text`
  color: white;
  font-size: 14px;
  font-family: 'Poppins_500Medium';
`;

export const BulletPoint = styled.Text`
  color: white;
  font-size: 14px;
  font-family: 'Poppins_400Regular';
  margin: 0 5px; // Adds space around the bullet point
`;


export const NotesHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px; // Optional: Add slight padding for spacing from the right edge
  margin-bottom: 20px;
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

export const NotesSection = styled.ScrollView`
  margin-top: 40px;
`;

export const NoAppointmentText = styled.Text`
  margin-top: 12px;
  font-family: 'Poppins_400Regular';
  font-size: 16px;
  color: #000;
  text-align: center;
  margin-top: 8px;
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
  width: 60px;
  height: 62px;
  border-radius: 20px;
  background-color: #DFC2FA;
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
  background-color: #41245C;
  padding: 8px 12px;
  border-radius: 5px;
`;

export const DetailsButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-family: 'Poppins_600SemiBold';
`;

export const PlaceholderBackground = styled.View`
  width: 100%;
  height: 220px;
  background-color: #DFC2FA; /* Adjust to a preferred placeholder color */
  justify-content: flex-end;
  padding: 10px;
  padding-bottom: 15px;
`;

export const NoDogsContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const NoDogsText = styled.Text`
  font-size: 16px;
  color: #41245C;
  font-family: 'Poppins_400Regular';
  margin-top: 10px;
  text-align: center;
`;
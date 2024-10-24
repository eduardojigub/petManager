import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Container,
  HeaderSection,
 ProfileListSection,
  ProfileImage,
  ProfileName,
  SelectedDogSection,
  EditButton,
  EditButtonText,
  NotesSection,
  NotesTitle,
  WelcomeHeader,
  AddProfileCircle,
  MoreButtonText,
  NotesHeader,
  NoAppointmentText,
  NoteItemRow,
  IconCircle,
  DescriptionContainer,
  DescriptionText,
  SubtitleText,
  DetailsButton,
  DetailsButtonText,
  DogImageBackground,
  GradientOverlay,
  DogDetailsContainer,
  DogInfo,
  DogInfoText,
  DogInfoRow,
  InfoText,
  BulletPoint,
  ProfilePlaceholder,
  PlaceholderBackground,
  NoDogsContainer,
  NoDogsText,
} from './styles';

import ProfileListItem from './ProfileScreen components/ProfileListItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../firebase/Firestore';
import { PetContext } from '../../context/PetContext';
import auth from '@react-native-firebase/auth';
import * as IconPhospor from 'phosphor-react-native';
import { formatDateTime } from '../../utils/dateFormarter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePetProfiles from '../../hooks/usePetProfile';
import PetProfileList from './ProfileScreen components/PetProfileList';
import SelectedPetShowcase from './ProfileScreen components/SelectedPetShowcase';
import usePetContext from '../../context/PetContext';
export default function ProfileScreen() {
  const [dogProfiles, setDogProfiles] = useState([]);

  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
const {petProfiles} = usePetProfiles();
const { selectedPet, setSelectedPet } = usePetContext();


  // Ref to track the current loadId
  const loadIdRef = useRef(0);

  // useEffect(() => {
  //   setSelectedDog(null);
  // }, [userId]);

  // const loadProfiles = async () => {
  //   if (!userId) return;
  //   try {
  //     const profileSnapshot = await db
  //       .collection('dogProfiles')
  //       .where('userId', '==', userId)
  //       .get();
  //     const profiles = profileSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setDogProfiles(profiles);
  
  //     const storedDogId = await AsyncStorage.getItem('selectedDogId'); // Retrieve saved ID
  //     const savedDog = profiles.find((dog) => dog.id === storedDogId);
  
  //     // Set selectedDog to the saved dog if it exists, else default to first profile
  //     if (savedDog) {
  //       setSelectedDog(savedDog);
  //     } else if (profiles.length > 0) {
  //       setSelectedDog(profiles[0]);
  //     }
  //   } catch (error) {
  //     console.error('Failed to load dog profiles:', error);
  //   }
  // };

  // const loadSchedules = async () => {
  //   if (selectedDog && userId) {
  //     const currentLoadId = ++loadIdRef.current;
  //     setIsLoadingSchedules(true); // Start loading indicator
  //     try {
  //       const schedulesSnapshot = await db
  //         .collection('schedules')
  //         .where('dogId', '==', selectedDog.id)
  //         .where('userId', '==', userId)
  //         .get();

  //       const now = new Date(); // Current date and time
  //       const today = new Date(
  //         now.getFullYear(),
  //         now.getMonth(),
  //         now.getDate()
  //       ); // Start of today

  //       const schedules = schedulesSnapshot.docs
  //         .map((doc) => {
  //           const data = doc.data();

  //           // Parse schedule date and time
  //           const [year, month, day] = data.date.split('-').map(Number);
  //           const [hours, minutes] = data.time.split(':').map(Number);
  //           const scheduleDateTime = new Date(
  //             year,
  //             month - 1,
  //             day,
  //             hours,
  //             minutes
  //           );

  //           // Determine if the schedule is upcoming (today or later)
  //           const isUpcoming = scheduleDateTime >= today;

  //           return {
  //             id: doc.id,
  //             ...data,
  //             isUpcoming,
  //           };
  //         })
  //         .filter((schedule) => schedule.isUpcoming); // Only include upcoming schedules

  //       // Only set schedules if loadId hasn't changed
  //       if (currentLoadId === loadIdRef.current) {
  //         setUpcomingSchedules(schedules);
  //       }
  //     } catch (error) {
  //       console.error('Error loading schedules:', error);
  //     } finally {
  //       if (currentLoadId === loadIdRef.current) {
  //         setIsLoadingSchedules(false); // Stop loading only if still the latest
  //       }
  //     }
  //   }
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     loadProfiles();
  //   }, [userId])
  // );

  // useEffect(() => {
  //   loadSchedules();
  // }, [selectedDog]);

  // const handleSelectDog = async (dog) => {
  //   setSelectedDog(dog);
  //   loadSchedules();
  
  //   try {
  //     await AsyncStorage.setItem('selectedDogId', dog.id); // Save selected dog's ID
  //   } catch (error) {
  //     console.error('Failed to save selected dog ID', error);
  //   }
  // };


  
  // Map each type to its corresponding icon
  const typeIcons = {
    Vaccine: <IconPhospor.Syringe size={32} color="#41245C" />,
    'Vet Appointment': <IconPhospor.Stethoscope size={32} color="#41245C" />,
    Medication: <IconPhospor.Pill size={32} color="#41245C" />,
    'Dog Groomer': <IconPhospor.Scissors size={32} color="#41245C" />,
    Other: <IconPhospor.FileText size={32} color="#41245C" />,
  };

  const renderScheduleItem = (schedule) => {
    const icon = typeIcons[schedule.type] || typeIcons.Other;

    return (
      <NoteItemRow key={schedule.id}>
        <IconCircle>{icon}</IconCircle>
        <DescriptionContainer>
          <DescriptionText>{schedule.description}</DescriptionText>
          <SubtitleText>
            {formatDateTime(`${schedule.date} ${schedule.time}`)}
          </SubtitleText>
        </DescriptionContainer>

        <DetailsButton
          onPress={() =>
            navigation.navigate('AddSchedule', {
              schedule,
              isEditMode: true,
            })
          }
        >
          <DetailsButtonText>Details</DetailsButtonText>
        </DetailsButton>
      </NoteItemRow>
    );
  };

  const renderNoAppointment = () => (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <IconPhospor.CalendarDots
        size={64}
        color="#000"
        weight="thin"
        style={{ marginBottom: 10 }}
      />
      <NoAppointmentText>No upcoming schedules for now.</NoAppointmentText>
    </View>
  );

  const renderNoDogs = () => (
    <NoDogsContainer>
      <IconPhospor.PawPrint size={64} color="#41245C" weight="thin" />
      <NoDogsText>No dog profiles added. Start by creating one!</NoDogsText>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
        <AddProfileCircle>
          <Icon name="plus" size={40} color="#41245C" />
        </AddProfileCircle>
      </TouchableOpacity>
    </NoDogsContainer>
  );
  return (
    <Container>
      <HeaderSection>
        <WelcomeHeader>Welcome, human!</WelcomeHeader>
      </HeaderSection>

      {petProfiles.length === 0 ? (
        renderNoDogs() // Exibe o ícone e mensagem no centro da tela quando não há cachorros cadastrados
      ) : (
        <> 
        <ProfileListSection>
            <PetProfileList/>
         </ProfileListSection>

<SelectedDogSection>
         <SelectedPetShowcase />
</SelectedDogSection>

          <NotesSection showsVerticalScrollIndicator={false}>
            <NotesHeader>
              <NotesTitle>Upcoming Appointments</NotesTitle>
              <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                <MoreButtonText>More</MoreButtonText>
              </TouchableOpacity>
            </NotesHeader>

            {isLoadingSchedules ? (
              <ActivityIndicator
                size="large"
                color="#41245C"
                style={{ marginVertical: 20 }}
              />
            ) : upcomingSchedules.length > 0 ? (
              upcomingSchedules.map(renderScheduleItem)
            ) : (
              renderNoAppointment() // Display the icon and text when no schedules are available
            )}
          </NotesSection>
        </>
      )}
    </Container>
  );
}

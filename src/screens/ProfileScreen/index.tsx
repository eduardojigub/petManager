import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Container,
  Header,
  ProfileList,
  ProfileImage,
  ProfileName,
  SelectedDogSection,
  DogDetails,
  DogImage,
  EditButton,
  EditButtonText,
  NotesSection,
  NotesTitle,
  NoteItem,
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
} from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../firebase/Firestore';
import { DogProfileContext } from '../../context/DogProfileContext';
import auth from '@react-native-firebase/auth';
import * as IconPhospor from "phosphor-react-native";

export default function ProfileScreen() {
  const [dogProfiles, setDogProfiles] = useState<
    {
      id: string;
      image?: string;
      name: string;
      breed: string;
      age: number;
      weight: number;
    }[]
  >([]); // List of dog profiles
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext) as {
    selectedDog: any;
    setSelectedDog: (dog: any) => void;
  }; // Access context
  const [upcomingSchedules, setUpcomingSchedules] = useState([]); // List of schedules for the selected dog
  const navigation = useNavigation();

  const userId = auth().currentUser?.uid;

  // Clear selectedDog when userId changes
  useEffect(() => {
    setSelectedDog(null);
  }, [userId]);

  // Fetch dog profiles from Firestore
  const loadProfiles = async () => {
    if (!userId) return; // Ensure userId is defined

    try {
      const profileSnapshot = await db
        .collection('dogProfiles')
        .where('userId', '==', userId) // Filter by userId
        .get();

      const profiles = profileSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDogProfiles(profiles);
      if (profiles.length > 0) {
        setSelectedDog(profiles[0]); // Set the first dog as the selected initially
      }
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  };

  // Fetch schedules for the selected dog from Firestore
  const loadSchedules = async () => {
    if (selectedDog && userId) {
      try {
        const schedulesSnapshot = await db
          .collection('schedules')
          .where('dogId', '==', selectedDog.id)
          .where('userId', '==', userId) // Filter by userId
          .get();

        const schedules = schedulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUpcomingSchedules(schedules);
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles(); // Fetch dog profiles on screen focus
    }, [userId])
  );

  // Reload schedules every time the selected dog changes
  useEffect(() => {
    loadSchedules();
  }, [selectedDog]);

  // Handle dog selection
  const handleSelectDog = (dog) => {
    setSelectedDog(dog);
    loadSchedules();
  };

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectDog(item)}
      style={{ marginHorizontal: 10 }}
    >
      <View style={{ alignItems: 'center' }}>
        {item.image ? (
          <ProfileImage source={{ uri: item.image }} />
        ) : (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#ccc',
            }}
          />
        )}
        <ProfileName>{item.name}</ProfileName>
      </View>
    </TouchableOpacity>
  );

  const renderAddProfileButton = () => (
    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
      <AddProfileCircle>
        <Icon name="plus" size={40} color="#000" />
      </AddProfileCircle>
    </TouchableOpacity>
  );

  const renderScheduleItem = (schedule) => (
    <NoteItemRow key={schedule.id}>
      <IconCircle>
        <IconPhospor.Syringe size={20} color="#333" />
      </IconCircle>

      <DescriptionContainer>
        <DescriptionText>{schedule.description}</DescriptionText>
        <SubtitleText>{`${schedule.date} ${schedule.time}`}</SubtitleText>
      </DescriptionContainer>

      <DetailsButton
        onPress={() =>
          navigation.navigate('DetailsScreen', { scheduleId: schedule.id })
        }
      >
        <DetailsButtonText>Details</DetailsButtonText>
      </DetailsButton>
    </NoteItemRow>
  );

  return (
    <Container>
      {/* Header */}
      <Header>
        <WelcomeHeader>Welcome, human!</WelcomeHeader>
      </Header>

      {/* Horizontal List of Dog Profiles */}
      <ProfileList>
        <FlatList
          horizontal
          data={dogProfiles}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderAddProfileButton} // Show add button if list is empty
          ListFooterComponent={
            dogProfiles.length > 0 ? renderAddProfileButton : null
          } // Add button after the list
          showsHorizontalScrollIndicator={false}
        />
      </ProfileList>

      {/* Selected Dog Details */}
      {selectedDog && (
        <SelectedDogSection>
          <DogDetails>
            <DogImage source={{ uri: selectedDog.image }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {selectedDog.name}
            </Text>
            <Text>Breed: {selectedDog.breed}</Text>
            <Text>Age: {selectedDog.age} years</Text>
            <Text>Weight: {selectedDog.weight} kg</Text>
          </DogDetails>

          {/* Edit Profile Button */}
          <EditButton
            onPress={() => navigation.navigate('EditProfile', selectedDog)}
          >
            <EditButtonText>Edit Dog Profile</EditButtonText>
          </EditButton>
        </SelectedDogSection>
      )}

      {/* Upcoming Notes */}
      {selectedDog && (
        <NotesSection>
          <NotesHeader>
            <NotesTitle>Upcoming Appointments</NotesTitle>
            <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
              <MoreButtonText>More</MoreButtonText>
            </TouchableOpacity>
          </NotesHeader>

          {upcomingSchedules.length > 0 ? (
            upcomingSchedules.map(renderScheduleItem)
          ) : (
            <NoAppointmentText>
              No upcoming schedules for now.
            </NoAppointmentText>
          )}
        </NotesSection>
      )}
    </Container>
  );
}

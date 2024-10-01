import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Container, Header, ProfileList, ProfileImage, ProfileName, SelectedDogSection, DogDetails, DogImage, EditButton, EditButtonText, NotesSection, NotesTitle, NoteItem } from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DogProfileContext } from '../../context/DogProfileContext'


export default function ProfileScreen() {
  const [dogProfiles, setDogProfiles] = useState([]); // Lista de perfis de cachorros
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext); // Access context
  const [upcomingSchedules, setUpcomingSchedules] = useState([]); // List of schedules for the selected dog
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const loadProfiles = async () => {
        try {
          const storedProfiles = await AsyncStorage.getItem('dogProfiles');
          if (storedProfiles) {
            const parsedProfiles = JSON.parse(storedProfiles);
            setDogProfiles(parsedProfiles);
            setSelectedDog(parsedProfiles[0]); // Set the first dog as the selected initially
          } else {
            setDogProfiles([]);
          }
        } catch (error) {
          console.error('Failed to load dog profiles:', error);
        }
      };

      loadProfiles();
    }, [])
  );

  // Handle dog selection
  const handleSelectDog = (dog) => {
    setSelectedDog(dog);
    AsyncStorage.setItem('selectedDog', JSON.stringify(dog)); // Save the selected dog to AsyncStorage if needed
  };

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectDog(item)} style={{ marginHorizontal: 10 }}>
      <View style={{ alignItems: 'center' }}>
        <ProfileImage source={{ uri: item.image }} />
        <ProfileName>{item.name}</ProfileName>
      </View>
    </TouchableOpacity>
  );

   // Load schedules for the selected dog
   const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      if (storedSchedules) {
        const allSchedules = JSON.parse(storedSchedules);
        const filteredSchedules = allSchedules.filter(
          (schedule) => schedule.dogId === selectedDog?.id // Filter schedules for selected dog
        );
        setUpcomingSchedules(filteredSchedules);
      }
    } catch (error) {
      console.error('Error loading schedules', error);
    }
  };

  // Reload schedules every time the selected dog changes
  useEffect(() => {
    if (selectedDog) {
      loadSchedules();
    }
  }, [selectedDog]);

  // Add new profile button
  const renderAddProfileButton = () => (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        marginHorizontal: 10,
      }}
      onPress={() => navigation.navigate('EditProfile')}
    >
      <Icon name="plus" size={40} color="#7289DA" />
    </TouchableOpacity>
  );

  return (
    <Container>
      {/* Header */}
      <Header>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#7289DA' }}>Profile</Text>
      </Header>

      {/* Horizontal List of Dog Profiles */}
      <ProfileList>
        <FlatList
          horizontal
          data={dogProfiles}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderAddProfileButton} // Show add button if list is empty
          ListFooterComponent={dogProfiles.length > 0 ? renderAddProfileButton : null} // Add button after the list
          showsHorizontalScrollIndicator={false}
        />
      </ProfileList>

      {/* Selected Dog Details */}
      {selectedDog && (
        <SelectedDogSection>
          <DogDetails>
            <DogImage source={{ uri: selectedDog.image }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedDog.name}</Text>
            <Text>Breed: {selectedDog.breed}</Text>
            <Text>Age: {selectedDog.age} years</Text>
            <Text>Weight: {selectedDog.weight} kg</Text>
          </DogDetails>

          {/* Edit Profile Button */}
          <EditButton onPress={() => navigation.navigate('EditProfile', selectedDog)}>
            <EditButtonText>Edit Dog Profile</EditButtonText>
          </EditButton>
        </SelectedDogSection>
      )}

         {/* Upcoming Notes */}
      {selectedDog && (
        <NotesSection>
          <NotesTitle>Upcoming Schedules</NotesTitle>
          {upcomingSchedules.length > 0 ? (
            upcomingSchedules.map((schedule) => (
              <NoteItem key={schedule.id}>{schedule.description} - {schedule.date} {schedule.time}</NoteItem>
            ))
          ) : (
            <Text>No upcoming schedules for now.</Text>
          )}
        </NotesSection>
      )}
    </Container>
  );
}

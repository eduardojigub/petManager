import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Container,
  Header,
  ProfileList,
  WelcomeHeader,
  MoreButtonText,
  NotesSection,
  NotesHeader,
  NotesTitle,
  ScheduleLoadingIndicator,
} from './styles';
import { db } from '../../firebase/Firestore';
import { DogProfileContext } from '../../context/DogProfileContext';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DogProfile } from '../../types/dogProfile';
import ProfileItem from './components/ProfileItem';
import AddProfileButton from './components/AddProfileButton';
import DogDetailsCard from './components/DogDetailsCard';
import ScheduleItem from './components/ScheduleItem';
import NoAppointment from './components/NoAppointment';
import NoDogs from './components/NoDogs';

export default function ProfileScreen() {
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  const userId = auth().currentUser?.uid;
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const loadIdRef = useRef(0);

  useEffect(() => {
    setSelectedDog(null);
  }, [userId]);

  const loadProfiles = async () => {
    if (!userId) return;
    try {
      const profileSnapshot = await db
        .collection('dogProfiles')
        .where('userId', '==', userId)
        .get();
      const profiles = profileSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DogProfile[];
      setDogProfiles(profiles);

      const storedDogId = await AsyncStorage.getItem('selectedDogId');
      const savedDog = profiles.find((dog) => dog.id === storedDogId);

      if (savedDog) {
        setSelectedDog(savedDog);
      } else if (profiles.length > 0) {
        setSelectedDog(profiles[0]);
      }
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  };

  const loadSchedules = async () => {
    if (selectedDog && userId) {
      const currentLoadId = ++loadIdRef.current;
      setIsLoadingSchedules(true);
      try {
        const schedulesSnapshot = await db
          .collection('schedules')
          .where('dogId', '==', selectedDog.id)
          .where('userId', '==', userId)
          .get();

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const schedules = schedulesSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const [year, month, day] = data.date.split('-').map(Number);
            const [hours, minutes] = data.time.split(':').map(Number);
            const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);

            return {
              id: doc.id,
              ...data,
              isUpcoming: scheduleDateTime >= today,
            };
          })
          .filter((schedule) => schedule.isUpcoming);

        if (currentLoadId === loadIdRef.current) {
          setUpcomingSchedules(schedules);
        }
      } catch (error) {
        console.error('Error loading schedules:', error);
      } finally {
        if (currentLoadId === loadIdRef.current) {
          setIsLoadingSchedules(false);
        }
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
    }, [userId])
  );

  useEffect(() => {
    loadSchedules();
  }, [selectedDog]);

  const handleSelectDog = async (dog: DogProfile) => {
    setSelectedDog(dog);
    loadSchedules();
    try {
      await AsyncStorage.setItem('selectedDogId', dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  };

  const navigateToEditProfile = () => navigation.navigate('EditProfile');
  const navigateToEdit = (dog: DogProfile) => navigation.navigate('EditProfile', dog);

  return (
    <Container>
      <Header>
        <WelcomeHeader>Welcome, human!</WelcomeHeader>
      </Header>

      {dogProfiles.length === 0 ? (
        <NoDogs onAddProfile={navigateToEditProfile} />
      ) : (
        <>
          <ProfileList>
            <FlatList
              horizontal
              data={dogProfiles}
              renderItem={({ item }) => (
                <ProfileItem dog={item} onSelect={handleSelectDog} />
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<AddProfileButton onPress={navigateToEditProfile} />}
              ListFooterComponent={
                dogProfiles.length > 0
                  ? () => <AddProfileButton onPress={navigateToEditProfile} />
                  : null
              }
              showsHorizontalScrollIndicator={false}
            />
          </ProfileList>

          {selectedDog && <DogDetailsCard dog={selectedDog} onEdit={navigateToEdit} />}

          <NotesSection showsVerticalScrollIndicator={false}>
            <NotesHeader>
              <NotesTitle>Upcoming Appointments</NotesTitle>
              <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                <MoreButtonText>More</MoreButtonText>
              </TouchableOpacity>
            </NotesHeader>

            {isLoadingSchedules ? (
              <ScheduleLoadingIndicator />
            ) : upcomingSchedules.length > 0 ? (
              upcomingSchedules.map((schedule) => (
                <ScheduleItem
                  key={schedule.id}
                  schedule={schedule}
                  onViewDetails={(s) =>
                    navigation.navigate('AddSchedule', {
                      schedule: s,
                      isEditMode: true,
                    })
                  }
                />
              ))
            ) : (
              <NoAppointment />
            )}
          </NotesSection>
        </>
      )}
    </Container>
  );
}

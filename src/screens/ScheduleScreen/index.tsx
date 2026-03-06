import React, { useState, useContext, useRef } from 'react';
import { FlatList, Alert, ScrollView, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { TrashSimple } from 'phosphor-react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Container,
  ContentContainer,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  DogChipsRow,
  DogChip,
  DogChipImage,
  DogChipPlaceholder,
  DogChipPlaceholderText,
  DogChipText,
  FilterTabsRow,
  FilterTab,
  FilterTabText,
  ScheduleCard,
  ScheduleIconContainer,
  ScheduleContent,
  ScheduleTitle,
  ScheduleSubtitle,
  ScheduleRight,
  ScheduleDate,
  ScheduleTime,
  ScheduleBadge,
  ScheduleBadgeText,
  AddButton,
  AddButtonText,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
  SwipeDeleteButton,
  DeleteAllButton,
  DeleteAllButtonText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, query, where, getDocs, doc, deleteDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { DogProfile } from '../../types/dogProfile';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { confirmDelete } from '../../utils/confirmDelete';
import dogThingsImage from '../../assets/dogThings.png';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';
import { LanguageContext } from '../../context/LanguageContext';

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>;

const ICON_BG: Record<string, string> = {
  Vaccine: '#e8f5e9',
  'Vet Appointment': '#e3f2fd',
  Medication: '#fff3e0',
  'Pet Groomer': '#fce4ec',
  Other: '#f3e5f5',
};

const ICON_COLOR: Record<string, string> = {
  Vaccine: '#27ae60',
  'Vet Appointment': '#3498db',
  Medication: '#e67e22',
  'Pet Groomer': '#e91e63',
  Other: '#9b59b6',
};

const BORDER_COLOR: Record<string, string> = {
  Vaccine: '#27ae60',
  'Vet Appointment': '#3498db',
  Medication: '#e67e22',
  'Pet Groomer': '#e91e63',
  Other: '#9b59b6',
};

const FILTER_TAB_KEYS = [
  { key: 'schedule.upcoming', value: 'upcoming' },
  { key: 'schedule.past', value: 'past' },
];

function formatScheduleDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string): string {
  // Handle "9:14:38 PM" (12h) or "21:14:38" (24h) formats
  const parts = timeStr.trim().split(' ');
  const timePart = parts[0];
  const modifier = parts[1]?.toUpperCase(); // AM/PM if present
  const [hours, minutes] = timePart.split(':').map(Number);

  if (modifier) {
    // Already in 12h format
    return `${hours}:${String(minutes).padStart(2, '0')} ${modifier}`;
  }
  // 24h format
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`;
}

export default function ScheduleScreen({ navigation }: Props) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadProfiles = async () => {
    if (!userId) return;
    try {
      const snapshot = await getDocs(
        query(collection(db, 'dogProfiles'), where('userId', '==', userId))
      );
      const profiles = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      })) as DogProfile[];
      setDogProfiles(profiles);
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  };

  const loadSchedules = async () => {
    if (!selectedDog) {
      setSchedules([]);
      return;
    }
    try {
      const snapshot = await getDocs(
        query(collection(db, 'schedules'), where('dogId', '==', selectedDog.id))
      );
      const loaded = snapshot.docs.map((d: any) => {
        const data = d.data();
        const [year, month, day] = data.date.split('-').map(Number);

        // Parse time handling both "21:20" (24h) and "9:20:00 PM" (12h) formats
        const timeParts = data.time.trim().split(' ');
        let [hours, minutes] = timeParts[0].split(':').map(Number);
        const modifier = timeParts[1]?.toUpperCase();
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        const isPast = scheduleDateTime < now;
        return { id: d.id, ...data, isPast };
      });
      loaded.sort((a: any, b: any) => (a.date || '').localeCompare(b.date || ''));
      setSchedules(loaded);
    } catch (error) {
      console.error('Error loading schedules', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
      loadSchedules();
    }, [selectedDog, userId])
  );

  const handleSelectDog = async (dog: DogProfile) => {
    setSelectedDog(dog);
    try {
      await AsyncStorage.setItem('selectedDogId', dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  };

  const deleteSchedule = async (scheduleId: string, notificationId: string) => {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      await deleteDoc(doc(db, 'schedules', scheduleId));
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      Alert.alert(t('common.success'), t('alert.scheduleDeleted'));
    } catch (error) {
      console.error('Error deleting schedule', error);
      Alert.alert(t('common.error'), t('alert.failedDeleteSchedule'));
    }
  };

  const handleDelete = (scheduleId: string, notificationId: string) => {
    confirmDelete({
      title: t('alert.deleteSchedule'),
      message: t('alert.deleteScheduleMsg'),
      onConfirm: () => deleteSchedule(scheduleId, notificationId),
    });
  };

  const handleDeleteAll = () => {
    if (schedules.length === 0) return;
    Alert.alert(
      t('alert.deleteAllSchedules'),
      t('alert.deleteAllSchedulesMsg', { count: String(schedules.length), name: selectedDog?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              const results = await Promise.allSettled(
                schedules.map(async (s) => {
                  if (s.notificationId) {
                    await Notifications.cancelScheduledNotificationAsync(s.notificationId).catch(() => {});
                  }
                  await deleteDoc(doc(db, 'schedules', s.id));
                })
              );
              const failed = results.filter((r) => r.status === 'rejected');
              if (failed.length > 0) {
                console.error('Some schedule deletes failed:', failed);
                await loadSchedules();
                Alert.alert(t('common.error'), t('alert.someDeletesFailed'));
              } else {
                setSchedules([]);
                Alert.alert(t('common.success'), t('alert.allSchedulesDeleted'));
              }
            } catch (error) {
              console.error('Error deleting all schedules', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllSchedules'));
            }
          },
        },
      ]
    );
  };

  const filteredSchedules = schedules.filter((s) =>
    activeFilter === 'upcoming' ? !s.isPast : s.isPast
  );

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {/* Header */}
          <HeaderRow>
            <HeaderTitle>{t('schedule.title')}</HeaderTitle>
            {schedules.length > 0 && (
              <DeleteAllButton onPress={handleDeleteAll}>
                <DeleteAllButtonText>{t('common.deleteAll')}</DeleteAllButtonText>
              </DeleteAllButton>
            )}
          </HeaderRow>
          <HeaderSubtitle>
            {selectedDog ? t('schedule.subtitle', { name: selectedDog.name }) : t('schedule.subtitleEmpty')}
          </HeaderSubtitle>

          {/* Dog Chips */}
          {dogProfiles.length > 0 && (
            <DogChipsRow>
              <FlatList
                horizontal
                data={dogProfiles}
                renderItem={({ item }) => {
                  const isSelected = selectedDog?.id === item.id;
                  return (
                    <DogChip selected={isSelected} onPress={() => handleSelectDog(item)}>
                      {item.image ? (
                        <DogChipImage source={{ uri: item.image }} />
                      ) : (
                        <DogChipPlaceholder>
                          <DogChipPlaceholderText>
                            {item.name.charAt(0)}
                          </DogChipPlaceholderText>
                        </DogChipPlaceholder>
                      )}
                      <DogChipText selected={isSelected}>{item.name}</DogChipText>
                    </DogChip>
                  );
                }}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </DogChipsRow>
          )}

          {selectedDog && (
            <>
              {/* Filter Tabs */}
              <FilterTabsRow>
                {FILTER_TAB_KEYS.map((tab) => {
                  const isSelected = activeFilter === tab.value;
                  return (
                    <FilterTab
                      key={tab.value}
                      selected={isSelected}
                      onPress={() => setActiveFilter(tab.value)}
                    >
                      <FilterTabText selected={isSelected}>{t(tab.key)}</FilterTabText>
                    </FilterTab>
                  );
                })}
              </FilterTabsRow>

              {/* Add Button */}
              <AddButton onPress={() => navigation.navigate('AddSchedule')}>
                <AddButtonText>{t('schedule.addSchedule')}</AddButtonText>
              </AddButton>

              {/* Schedules */}
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((item) => (
                  <Swipeable
                    key={item.id}
                    renderRightActions={() => (
                      <SwipeDeleteButton onPress={() => handleDelete(item.id, item.notificationId)}>
                        <TrashSimple size={22} color="#fff" />
                      </SwipeDeleteButton>
                    )}
                    overshootRight={false}
                  >
                    <ScheduleCard
                      borderColor={BORDER_COLOR[item.type] || '#41245c'}
                      isPast={item.isPast}
                      onPress={() =>
                        navigation.navigate('AddSchedule', {
                          schedule: item,
                          isEditMode: true,
                        })
                      }
                    >
                      <ScheduleIconContainer bgColor={ICON_BG[item.type] || '#f0eff4'}>
                        {getHealthScheduleIcon(item.type, 20, ICON_COLOR[item.type] || '#41245c')}
                      </ScheduleIconContainer>
                      <ScheduleContent>
                        <ScheduleTitle>{item.description}</ScheduleTitle>
                        <ScheduleSubtitle>{item.type}</ScheduleSubtitle>
                      </ScheduleContent>
                      <ScheduleRight>
                        <ScheduleDate>{formatScheduleDate(item.date)}</ScheduleDate>
                        <ScheduleTime>{formatTime(item.time)}</ScheduleTime>
                        {item.isPast ? (
                          <ScheduleBadge bgColor="#f0f0f0">
                            <ScheduleBadgeText color="#999">{t('schedule.past')}</ScheduleBadgeText>
                          </ScheduleBadge>
                        ) : (
                          <ScheduleBadge bgColor="#e8f5e9">
                            <ScheduleBadgeText color="#27ae60">{t('schedule.scheduled')}</ScheduleBadgeText>
                          </ScheduleBadge>
                        )}
                      </ScheduleRight>
                    </ScheduleCard>
                  </Swipeable>
                ))
              ) : (
                <EmptyContainer>
                  <EmptyText>
                    {activeFilter === 'upcoming' ? t('schedule.noUpcoming') : t('schedule.noPast')}
                  </EmptyText>
                  <EmptySubtext>
                    {activeFilter === 'upcoming'
                      ? t('schedule.noUpcomingSub')
                      : t('schedule.noPastSub')}
                  </EmptySubtext>
                </EmptyContainer>
              )}
            </>
          )}

          {!selectedDog && dogProfiles.length === 0 && (
            <EmptyContainer>
              <EmptyImage source={dogThingsImage} resizeMode="contain" />
              <EmptyText>{t('schedule.noPets')}</EmptyText>
              <EmptySubtext>{t('schedule.noPetsSub')}</EmptySubtext>
            </EmptyContainer>
          )}
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

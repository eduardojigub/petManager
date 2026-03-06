import React, { useState, useContext } from 'react';
import { FlatList, Alert, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CaretRight, TrashSimple } from 'phosphor-react-native';
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
  StatsCard,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  FilterTabsContainer,
  FilterTabsRow,
  FilterTab,
  FilterTabText,
  ScrollHint,
  RecordCard,
  RecordIconContainer,
  RecordContent,
  RecordTitle,
  RecordSubtitle,
  RecordRight,
  RecordDate,
  RecordBadge,
  RecordBadgeText,
  AddButton,
  AddButtonText,
  DeleteAllButton,
  DeleteAllButtonText,
  SwipeDeleteButton,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, query, where, getDocs, doc, deleteDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DogProfile } from '../../types/dogProfile';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { formatShortDate } from '../../utils/dateFormarter';
import { confirmDelete } from '../../utils/confirmDelete';
import * as Notifications from 'expo-notifications';
import healthRecordsImage from '../../assets/healthRecords.png';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { LanguageContext } from '../../context/LanguageContext';

type Props = StackScreenProps<HealthStackParamList, 'HealthRecords'>;

const FILTER_TAB_KEYS = [
  { key: 'health.allRecords', value: null },
  { key: 'health.vaccines', value: 'Vaccine' },
  { key: 'health.vetVisits', value: 'Vet Appointment' },
  { key: 'health.medication', value: 'Medication' },
  { key: 'health.grooming', value: 'Pet Groomer' },
];

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
  Vaccine: '#7289da',
  'Vet Appointment': '#3498db',
  Medication: '#e67e22',
  'Pet Groomer': '#e91e63',
  Other: '#9b59b6',
};

function getBadgeStyle(record: any, t: (key: string) => string): { bg: string; color: string; label: string } {
  if (!record.dueDate) {
    return { bg: '#e0f5e9', color: '#27ae60', label: t('health.complete') };
  }

  const now = new Date();
  const due = new Date(record.dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { bg: '#fdecea', color: '#e74c3c', label: t('health.expired') };
  }
  if (diffDays <= 7) {
    return { bg: '#fff3e0', color: '#e67e22', label: t('health.expiringSoon') };
  }
  return { bg: '#e8f5e9', color: '#27ae60', label: t('health.active') };
}

export default function HealthRecordsScreen({ navigation }: Props) {
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);
  const [showFilterFade, setShowFilterFade] = useState(true);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const loadProfiles = async () => {
    if (!userId) return;
    try {
      const snapshot = await getDocs(
        query(collection(db, 'dogProfiles'), where('userId', '==', userId))
      );
      const profiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DogProfile[];
      setDogProfiles(profiles);
    } catch (error) {
      console.error('Failed to load dog profiles:', error);
    }
  };

  const loadRecords = async () => {
    if (!selectedDog) {
      setHealthRecords([]);
      return;
    }
    try {
      const snapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      records.sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
      setHealthRecords(records);
    } catch (error) {
      console.error('Error loading health records', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
      loadRecords();
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

  const handleConfirmDelete = (id: string) => {
    confirmDelete({
      title: t('alert.deleteRecord'),
      message: t('alert.deleteRecordMsg'),
      onConfirm: () => deleteHealthRecord(id),
    });
  };

  const deleteHealthRecord = async (id: string) => {
    try {
      const record = healthRecords.find((r) => r.id === id);
      if (record?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(record.notificationId).catch(() => {});
      }
      await deleteDoc(doc(db, 'healthRecords', id));
      setHealthRecords((prev) => prev.filter((r) => r.id !== id));
      Alert.alert(t('common.success'), t('alert.recordDeleted'));
    } catch (error) {
      console.error('Error deleting health record', error);
      Alert.alert(t('common.error'), t('alert.failedDeleteRecord'));
    }
  };

  const handleDeleteAll = () => {
    if (healthRecords.length === 0) return;
    Alert.alert(
      t('alert.deleteAllRecords'),
      t('alert.deleteAllRecordsMsg', { count: String(healthRecords.length), name: selectedDog?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.deleteAll'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                healthRecords.map(async (r) => {
                  if (r.notificationId) {
                    await Notifications.cancelScheduledNotificationAsync(r.notificationId).catch(() => {});
                  }
                  await deleteDoc(doc(db, 'healthRecords', r.id));
                })
              );
              setHealthRecords([]);
              Alert.alert(t('common.success'), t('alert.allRecordsDeleted'));
            } catch (error) {
              console.error('Error deleting all records', error);
              Alert.alert(t('common.error'), t('alert.failedDeleteAllRecords'));
            }
          },
        },
      ]
    );
  };

  const filteredRecords = activeFilter
    ? healthRecords.filter((r) => r.type === activeFilter)
    : healthRecords;

  // Stats
  const totalRecords = healthRecords.length;
  const vaccineCount = healthRecords.filter((r) => r.type === 'Vaccine').length;
  const vetVisitCount = healthRecords.filter((r) => r.type === 'Vet Appointment').length;
  const allergyCount = healthRecords.filter(
    (r) => r.type === 'Medication' || r.type === 'Other'
  ).length;

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {/* Header */}
          <HeaderRow>
            <HeaderTitle>{t('health.title')}</HeaderTitle>
            {healthRecords.length > 0 && (
              <DeleteAllButton onPress={handleDeleteAll}>
                <DeleteAllButtonText>{t('common.deleteAll')}</DeleteAllButtonText>
              </DeleteAllButton>
            )}
          </HeaderRow>
          <HeaderSubtitle>
            {selectedDog ? t('health.subtitle', { name: selectedDog.name }) : t('health.subtitleEmpty')}
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
              {/* Stats */}
              <StatsCard>
                <StatsRow>
                  <StatCard>
                    <StatValue color="#41245c">{totalRecords}</StatValue>
                    <StatLabel>{t('health.total')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#27ae60">{vaccineCount}</StatValue>
                    <StatLabel>{t('health.vaccines')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#3498db">{vetVisitCount}</StatValue>
                    <StatLabel>{t('health.visits')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#e67e22">{allergyCount}</StatValue>
                    <StatLabel>{t('health.other')}</StatLabel>
                  </StatCard>
                </StatsRow>
              </StatsCard>

              {/* Filter Tabs */}
              <FilterTabsContainer>
                <FilterTabsRow>
                  <FlatList
                    horizontal
                    data={FILTER_TAB_KEYS}
                    renderItem={({ item }) => {
                      const isSelected = activeFilter === item.value;
                      return (
                        <FilterTab
                          selected={isSelected}
                          onPress={() => setActiveFilter(item.value)}
                        >
                          <FilterTabText selected={isSelected}>{t(item.key)}</FilterTabText>
                        </FilterTab>
                      );
                    }}
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
                      const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
                      if (isAtEnd && showFilterFade) setShowFilterFade(false);
                      else if (!isAtEnd && !showFilterFade) setShowFilterFade(true);
                    }}
                    scrollEventThrottle={16}
                  />
                </FilterTabsRow>
                {showFilterFade && (
                  <ScrollHint>
                    <CaretRight size={16} color="#999" />
                  </ScrollHint>
                )}
              </FilterTabsContainer>

              {/* Add Button */}
              <AddButton
                onPress={() =>
                  navigation.navigate('AddHealthRecord', { onGoBack: () => loadRecords() })
                }
              >
                <AddButtonText>{t('health.addRecord')}</AddButtonText>
              </AddButton>

              {/* Records */}
              {filteredRecords.length > 0 ? (
                <>
                  {filteredRecords.map((item) => {
                    const badge = getBadgeStyle(item, t);
                    const displayText =
                      item.type === 'Medication' || item.type === 'Vaccine'
                        ? item.extraInfo || item.type
                        : item.type;

                    return (
                      <Swipeable
                        key={item.id}
                        renderRightActions={() => (
                          <SwipeDeleteButton onPress={() => handleConfirmDelete(item.id)}>
                            <TrashSimple size={22} color="#fff" />
                          </SwipeDeleteButton>
                        )}
                        overshootRight={false}
                      >
                        <RecordCard
                          borderColor={BORDER_COLOR[item.type] || '#41245c'}
                          onPress={() =>
                            navigation.navigate('HealthRecordDetails', { record: item })
                          }
                        >
                          <RecordIconContainer bgColor={ICON_BG[item.type] || '#f0eff4'}>
                            {getHealthScheduleIcon(item.type, 20, ICON_COLOR[item.type] || '#41245c')}
                          </RecordIconContainer>
                          <RecordContent>
                            <RecordTitle>{displayText}</RecordTitle>
                            <RecordSubtitle>{item.description || item.type}</RecordSubtitle>
                          </RecordContent>
                          <RecordRight>
                            <RecordDate>{formatShortDate(item.date)}</RecordDate>
                            <RecordBadge bgColor={badge.bg}>
                              <RecordBadgeText color={badge.color}>{badge.label}</RecordBadgeText>
                            </RecordBadge>
                          </RecordRight>
                        </RecordCard>
                      </Swipeable>
                    );
                  })}
                </>
              ) : (
                <EmptyContainer>
                  <EmptyText>{t('health.noRecords')}</EmptyText>
                  <EmptySubtext>{t('health.noRecordsSub')}</EmptySubtext>
                </EmptyContainer>
              )}
            </>
          )}

          {!selectedDog && dogProfiles.length === 0 && (
            <EmptyContainer>
              <EmptyImage source={healthRecordsImage} resizeMode="contain" />
              <EmptyText>{t('health.noPets')}</EmptyText>
              <EmptySubtext>{t('health.noPetsSub')}</EmptySubtext>
            </EmptyContainer>
          )}
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

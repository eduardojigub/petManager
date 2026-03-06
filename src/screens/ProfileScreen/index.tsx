import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/Firestore';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { DogProfileContext } from '../../context/DogProfileContext';
import { LanguageContext } from '../../context/LanguageContext';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DogProfile } from '../../types/dogProfile';
import { Plus, DotsThreeVertical, FirstAidKit, CalendarPlus, CurrencyDollar, Stethoscope, Syringe, CurrencyCircleDollar } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PawPrint } from 'phosphor-react-native';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { formatShortDate } from '../../utils/dateFormarter';
import {
  Container,
  ContentContainer,
  TopCard,
  HeaderRow,
  GreetingText,
  GreetingSubtext,
  UserAvatar,
  UserAvatarImage,
  UserAvatarText,
  SectionTitle,
  DogChipsRow,
  DogChip,
  DogChipImage,
  DogChipPlaceholder,
  DogChipPlaceholderText,
  DogChipText,
  AddDogChip,
  DogDetailCard,
  DogDetailHeader,
  DogDetailImage,
  DogDetailPlaceholder,
  DogDetailInfo,
  DogDetailName,
  DogDetailBreed,
  DogDetailMeta,
  EditDogButton,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  QuickActionsTitle,
  QuickActionButton,
  QuickActionText,
  RecentActivityCard,
  RecentHeader,
  RecentTitle,
  ViewAllText,
  ActivityItem,
  ActivityIconContainer,
  ActivityInfo,
  ActivityTitle,
  ActivityTime,
  NoDogsContainer,
  NoDogsText,
  AddProfileCircle,
  EmptyStateText,
  ScheduleLoadingIndicator,
} from './styles';

function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('profile.goodMorning');
  if (hour < 18) return t('profile.goodAfternoon');
  return t('profile.goodEvening');
}

function calculateDisplayAge(dog: DogProfile, t: (key: string, params?: Record<string, string>) => string): string {
  if (dog.birthday) {
    const bday = new Date(dog.birthday);
    const now = new Date();
    let years = now.getFullYear() - bday.getFullYear();
    let months = now.getMonth() - bday.getMonth();
    if (months < 0) { years--; months += 12; }
    if (now.getDate() < bday.getDate()) { months--; if (months < 0) { years--; months += 12; } }
    if (years === 0) return t('profile.ageMonths', { count: String(months) });
    if (months === 0) return t('profile.ageYears', { count: String(years) });
    return t('profile.ageYearsMonths', { years: String(years), months: String(months) });
  }
  return dog.age ? t('profile.years', { count: String(dog.age) }) : '';
}

function getTimeAgo(dateStr: string, t: (key: string, params?: Record<string, string>) => string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 1) return t('time.tomorrow');
    if (futureDays < 7) return t('time.inDays', { count: String(futureDays) });
    if (futureDays < 30) return t('time.inWeeks', { count: String(Math.floor(futureDays / 7)) });
    return t('time.inMonths', { count: String(Math.floor(futureDays / 30)) });
  }
  if (diffDays === 0) return t('time.today');
  if (diffDays === 1) return t('time.1dayAgo');
  if (diffDays < 7) return t('time.daysAgo', { count: String(diffDays) });
  if (diffDays < 30) return t('time.weeksAgo', { count: String(Math.floor(diffDays / 7)) });
  return t('time.monthsAgo', { count: String(Math.floor(diffDays / 30)) });
}

export default function ProfileScreen() {
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const { selectedDog, setSelectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [healthCount, setHealthCount] = useState(0);
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Human';
  const userPhoto = user?.photoURL || null;
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    setSelectedDog(null);
  }, [userId]);

  const loadProfiles = async () => {
    if (!userId) return;
    try {
      const profileSnapshot = await getDocs(
        query(collection(db, 'dogProfiles'), where('userId', '==', userId))
      );
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

  const loadDogData = async () => {
    if (!selectedDog || !userId) return;
    const currentLoadId = ++loadIdRef.current;
    setIsLoading(true);

    try {
      // Load schedules
      const schedulesSnapshot = await getDocs(
        query(
          collection(db, 'schedules'),
          where('dogId', '==', selectedDog.id),
          where('userId', '==', userId)
        )
      );

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const schedules = schedulesSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const [year, month, day] = data.date.split('-').map(Number);
          const [hours, minutes] = data.time.split(':').map(Number);
          const scheduleDateTime = new Date(year, month - 1, day, hours, minutes);
          return { id: doc.id, ...data, isUpcoming: scheduleDateTime >= today };
        })
        .filter((s) => s.isUpcoming);

      // Load health records
      const healthSnapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );

      // Load expenses (current month)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const expensesSnapshot = await getDocs(
        query(collection(db, 'expenses'), where('dogId', '==', selectedDog.id))
      );
      const allExpenses = expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const thisMonthTotal = allExpenses
        .filter((e: any) => e.date >= startOfMonth)
        .reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

      // Build recent activity from all data
      const activities: any[] = [];
      healthSnapshot.docs.forEach((doc) => {
        const d = doc.data();
        activities.push({
          id: doc.id,
          title: `${d.type} — ${d.description || 'Record added'}`,
          date: d.date,
          icon: 'health',
          type: d.type,
        });
      });
      allExpenses.forEach((e: any) => {
        activities.push({
          id: e.id,
          title: `${e.title || e.type} — $${(e.amount || 0).toFixed(2)}`,
          date: e.date,
          icon: 'expense',
          type: e.type,
        });
      });
      schedulesSnapshot.docs.forEach((doc) => {
        const d = doc.data();
        activities.push({
          id: doc.id,
          title: `${d.type} — ${d.description || 'Scheduled'}`,
          date: d.date,
          icon: 'schedule',
          type: d.type,
        });
      });

      activities.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (currentLoadId === loadIdRef.current) {
        setUpcomingSchedules(schedules);
        setHealthCount(healthSnapshot.docs.length);
        setMonthExpenses(thisMonthTotal);
        setRecentActivity(activities.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dog data:', error);
    } finally {
      if (currentLoadId === loadIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
    }, [userId])
  );

  useEffect(() => {
    loadDogData();
  }, [selectedDog]);

  const handleSelectDog = async (dog: DogProfile) => {
    setSelectedDog(dog);
    try {
      await AsyncStorage.setItem('selectedDogId', dog.id);
    } catch (error) {
      console.error('Failed to save selected dog ID', error);
    }
  };

  const navigateToEditProfile = () => navigation.navigate('EditProfile');
  const navigateToEdit = (dog: DogProfile) => navigation.navigate('EditProfile', dog);

  const ACTIVITY_ICON_COLOR: Record<string, string> = {
    Vaccine: '#27ae60',
    'Vet Appointment': '#3498db',
    Medication: '#e67e22',
    'Pet Groomer': '#e91e63',
    Other: '#9b59b6',
  };

  const ACTIVITY_ICON_BG: Record<string, string> = {
    Vaccine: '#e8f5e9',
    'Vet Appointment': '#e3f2fd',
    Medication: '#fff3e0',
    'Pet Groomer': '#fce4ec',
    Other: '#f3e5f5',
  };

  const getActivityIcon = (item: any) => {
    if (item.icon === 'health' || item.icon === 'schedule') {
      return getHealthScheduleIcon(item.type, 18, ACTIVITY_ICON_COLOR[item.type] || '#41245c');
    }
    return <CurrencyCircleDollar size={18} color="#e67e22" weight="bold" />;
  };

  const getActivityBg = (item: any) => {
    if (item.icon === 'health' || item.icon === 'schedule') {
      return ACTIVITY_ICON_BG[item.type] || '#ede8f5';
    }
    if (item.icon === 'expense') return '#fdf0e0';
    return '#e0eef9';
  };

  return (
    <Container>
      <ContentContainer>
        <TopCard>
          {/* Header */}
          <HeaderRow>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <GreetingText>{getGreeting(t)}</GreetingText>
              <GreetingSubtext>{t('profile.welcomeBack', { name: userName })}</GreetingSubtext>
            </TouchableOpacity>
            {userPhoto ? (
              <UserAvatarImage source={{ uri: userPhoto }} />
            ) : (
              <UserAvatar>
                <UserAvatarText>{userInitial}</UserAvatarText>
              </UserAvatar>
            )}
          </HeaderRow>

          {dogProfiles.length === 0 ? (
            <NoDogsContainer>
              <PawPrint size={64} color="#41245c" weight="thin" />
              <NoDogsText>{t('profile.noPets')}</NoDogsText>
              <TouchableOpacity onPress={navigateToEditProfile}>
                <AddProfileCircle>
                  <Icon name="plus" size={40} color="#41245c" />
                </AddProfileCircle>
              </TouchableOpacity>
            </NoDogsContainer>
          ) : (
            <>
              {/* Your Dogs */}
              <SectionTitle>{t('profile.yourDogs')}</SectionTitle>
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
                ListFooterComponent={
                  <AddDogChip onPress={navigateToEditProfile}>
                    <Plus size={20} color="#41245c" weight="bold" />
                  </AddDogChip>
                }
                showsHorizontalScrollIndicator={false}
              />
            </DogChipsRow>
          </>
        )}
        </TopCard>

        {dogProfiles.length > 0 && (
          <>
            {/* Dog Detail Card */}
            {selectedDog && (
              <DogDetailCard>
                <DogDetailHeader>
                  {selectedDog.image ? (
                    <DogDetailImage source={{ uri: selectedDog.image }} />
                  ) : (
                    <DogDetailPlaceholder>
                      <Icon name="dog" size={32} color="#41245c" />
                    </DogDetailPlaceholder>
                  )}
                  <DogDetailInfo>
                    <DogDetailName>{selectedDog.name}</DogDetailName>
                    <DogDetailBreed>
                      {selectedDog.breed}
                      {selectedDog.gender ? ` · ${selectedDog.gender}` : ''}
                    </DogDetailBreed>
                    <DogDetailMeta>
                      {calculateDisplayAge(selectedDog, t)}
                      {calculateDisplayAge(selectedDog, t) && selectedDog.weight ? '  ·  ' : ''}
                      {selectedDog.weight ? `${selectedDog.weight} kg` : ''}
                    </DogDetailMeta>
                  </DogDetailInfo>
                  <EditDogButton onPress={() => navigateToEdit(selectedDog)}>
                    <DotsThreeVertical size={22} color="#999" weight="bold" />
                  </EditDogButton>
                </DogDetailHeader>

                {/* Stats */}
                <StatsRow>
                  <StatCard bgColor="#f0eff4" onPress={() => navigation.navigate('Health' as any)}>
                    <StatValue color="#41245c">{healthCount}</StatValue>
                    <StatLabel>{t('profile.petRecords')}</StatLabel>
                  </StatCard>
                  <StatCard bgColor="#edf2fb" onPress={() => navigation.navigate('Schedule' as any)}>
                    <StatValue color="#7289da">{upcomingSchedules.length}</StatValue>
                    <StatLabel>{t('profile.upcoming')}</StatLabel>
                  </StatCard>
                  <StatCard bgColor="#f5f0eb" onPress={() => navigation.navigate('Expenses' as any)}>
                    <StatValue color="#c0792a">${monthExpenses.toFixed(0)}</StatValue>
                    <StatLabel>{t('profile.thisMonth')}</StatLabel>
                  </StatCard>
                </StatsRow>
              </DogDetailCard>
            )}

            {/* Quick Actions */}
            {selectedDog && (
              <>
                <QuickActionsTitle>{t('profile.quickActions')}</QuickActionsTitle>
                <QuickActionButton
                  bgColor="#41245c"
                  onPress={() =>
                    navigation.navigate('Health', {
                      screen: 'AddHealthRecord',
                      params: {
                        fromProfile: true,
                        onGoBack: () => {
                          loadDogData();
                          navigation.navigate('ProfileTab');
                        },
                      },
                    })
                  }
                >
                  <FirstAidKit size={20} color="#fff" weight="bold" />
                  <QuickActionText>{t('profile.addRecord')}</QuickActionText>
                </QuickActionButton>

                <QuickActionButton
                  bgColor="#7289da"
                  onPress={() =>
                    navigation.navigate('Schedule', {
                      screen: 'AddSchedule',
                      params: { fromProfile: true },
                    })
                  }
                >
                  <CalendarPlus size={20} color="#fff" weight="bold" />
                  <QuickActionText>{t('profile.addAppointment')}</QuickActionText>
                </QuickActionButton>

                <QuickActionButton
                  bgColor="#e67e22"
                  onPress={() => navigation.navigate('AddExpense')}
                >
                  <CurrencyDollar size={20} color="#fff" weight="bold" />
                  <QuickActionText>{t('profile.addExpense')}</QuickActionText>
                </QuickActionButton>
              </>
            )}

            {/* Recent Activity */}
            {selectedDog && (
              <RecentActivityCard>
                <RecentHeader>
                  <RecentTitle>{t('profile.recentActivity')}</RecentTitle>
                  <TouchableOpacity onPress={() => navigation.navigate('Health')}>
                    <ViewAllText>{t('profile.viewAll')}</ViewAllText>
                  </TouchableOpacity>
                </RecentHeader>

                {isLoading ? (
                  <ScheduleLoadingIndicator />
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <ActivityItem key={item.id}>
                      <ActivityIconContainer bgColor={getActivityBg(item)}>
                        {getActivityIcon(item)}
                      </ActivityIconContainer>
                      <ActivityInfo>
                        <ActivityTitle numberOfLines={1}>{item.title}</ActivityTitle>
                        <ActivityTime>{item.date ? getTimeAgo(item.date, t) : ''}</ActivityTime>
                      </ActivityInfo>
                    </ActivityItem>
                  ))
                ) : (
                  <EmptyStateText>{t('profile.noActivity')}</EmptyStateText>
                )}
              </RecentActivityCard>
            )}
          </>
        )}
      </ContentContainer>
    </Container>
  );
}

import React, { useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../context/LanguageContext';
import { Plus, PawPrint } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDogProfiles } from '../../hooks/useDogProfiles';
import { useProfileData } from './hooks/useProfileData';
import DogChipSelector from '../../components/DogChipSelector';
import DogDetailSection from './components/DogDetailSection';
import QuickActions from './components/QuickActions';
import RecentActivitySection from './components/RecentActivity';
import {
  Container, ContentContainer, TopCard, HeaderRow,
  GreetingText, GreetingSubtext, UserAvatar, UserAvatarImage, UserAvatarText,
  SectionTitle, AddDogChip, NoDogsContainer, NoDogsText, AddProfileCircle,
} from './styles';

function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('profile.goodMorning');
  if (hour < 18) return t('profile.goodAfternoon');
  return t('profile.goodEvening');
}

export default function ProfileScreen() {
  const { t } = useContext(LanguageContext);
  const navigation = useNavigation<any>();
  const { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog } = useDogProfiles();
  const {
    user, upcomingSchedules, healthCount, monthExpenses,
    recentActivity, isLoading, loadDogData,
  } = useProfileData();

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Human';
  const userPhoto = user?.photoURL || null;
  const userInitial = userName.charAt(0).toUpperCase();

  useFocusEffect(
    React.useCallback(() => { loadProfiles(); }, [userId])
  );

  useEffect(() => { loadDogData(); }, [selectedDog]);

  return (
    <Container>
      <ContentContainer>
        <TopCard>
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
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <AddProfileCircle>
                  <Icon name="plus" size={40} color="#41245c" />
                </AddProfileCircle>
              </TouchableOpacity>
            </NoDogsContainer>
          ) : (
            <>
              <SectionTitle>{t('profile.yourDogs')}</SectionTitle>
              <DogChipSelector
                dogProfiles={dogProfiles}
                selectedDogId={selectedDog?.id}
                onSelectDog={handleSelectDog}
                footerComponent={
                  <AddDogChip onPress={() => navigation.navigate('EditProfile')}>
                    <Plus size={20} color="#41245c" weight="bold" />
                  </AddDogChip>
                }
              />
            </>
          )}
        </TopCard>

        {dogProfiles.length > 0 && selectedDog && (
          <>
            <DogDetailSection
              dog={selectedDog}
              healthCount={healthCount}
              upcomingCount={upcomingSchedules.length}
              monthExpenses={monthExpenses}
              onEdit={() => navigation.navigate('EditProfile', selectedDog)}
              onNavHealth={() => navigation.navigate('Health' as any)}
              onNavSchedule={() => navigation.navigate('Schedule' as any)}
              onNavExpenses={() => navigation.navigate('Expenses' as any)}
              t={t}
            />

            <QuickActions
              onAddRecord={() => navigation.navigate('Health', {
                screen: 'AddHealthRecord',
                params: {
                  fromProfile: true,
                  onGoBack: () => { loadDogData(); navigation.navigate('ProfileTab'); },
                },
              })}
              onAddSchedule={() => navigation.navigate('Schedule', {
                screen: 'AddSchedule',
                params: { fromProfile: true },
              })}
              onAddExpense={() => navigation.navigate('AddExpense')}
              t={t}
            />

            <RecentActivitySection
              recentActivity={recentActivity}
              isLoading={isLoading}
              onViewAll={() => navigation.navigate('Health')}
              t={t}
            />
          </>
        )}
      </ContentContainer>
    </Container>
  );
}

import React, { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Container,
  ContentContainer,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  AddButton,
  AddButtonText,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
  DeleteAllButton,
  DeleteAllButtonText,
} from './styles';
import { LanguageContext } from '../../context/LanguageContext';
import { useDogProfiles } from '../../hooks/useDogProfiles';
import { useSchedules } from './hooks/useSchedules';
import DogChipSelector from '../../components/DogChipSelector';
import FilterTabs from '../../components/FilterTabs';
import ScheduleCardItem from './components/ScheduleCardItem';
import dogThingsImage from '../../assets/dogThings.png';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>;

const FILTER_TAB_KEYS = [
  { key: 'schedule.upcoming', value: 'upcoming' },
  { key: 'schedule.past', value: 'past' },
];

export default function ScheduleScreen({ navigation }: Props) {
  const { t } = useContext(LanguageContext);
  const { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog } = useDogProfiles();
  const { schedules, loadSchedules, handleDelete, handleDeleteAll } = useSchedules();
  const [activeFilter, setActiveFilter] = useState('upcoming');

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
      loadSchedules();
    }, [selectedDog, userId])
  );

  const filteredSchedules = schedules.filter((s) =>
    activeFilter === 'upcoming' ? !s.isPast : s.isPast
  );

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
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

          <DogChipSelector
            dogProfiles={dogProfiles}
            selectedDogId={selectedDog?.id}
            onSelectDog={handleSelectDog}
          />

          {selectedDog && (
            <>
              <FilterTabs
                tabs={FILTER_TAB_KEYS}
                activeValue={activeFilter}
                onSelect={(value) => setActiveFilter(value || 'upcoming')}
                renderLabel={(tab) => t(tab.key)}
              />

              <AddButton onPress={() => navigation.navigate('AddSchedule')}>
                <AddButtonText>{t('schedule.addSchedule')}</AddButtonText>
              </AddButton>

              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((item) => (
                  <ScheduleCardItem
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onEdit={(s) => navigation.navigate('AddSchedule', { schedule: s, isEditMode: true })}
                    pastLabel={t('schedule.past')}
                    scheduledLabel={t('schedule.scheduled')}
                  />
                ))
              ) : (
                <EmptyContainer>
                  <EmptyText>
                    {activeFilter === 'upcoming' ? t('schedule.noUpcoming') : t('schedule.noPast')}
                  </EmptyText>
                  <EmptySubtext>
                    {activeFilter === 'upcoming' ? t('schedule.noUpcomingSub') : t('schedule.noPastSub')}
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

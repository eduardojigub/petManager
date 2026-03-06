import React, { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Container,
  ContentContainer,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  StatsCard,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  AddButton,
  AddButtonText,
  DeleteAllButton,
  DeleteAllButtonText,
  EmptyContainer,
  EmptyImage,
  EmptyText,
  EmptySubtext,
} from './styles';
import { LanguageContext } from '../../context/LanguageContext';
import { useDogProfiles } from '../../hooks/useDogProfiles';
import { useHealthRecords } from './hooks/useHealthRecords';
import DogChipSelector from '../../components/DogChipSelector';
import FilterTabs from '../../components/FilterTabs';
import HealthRecordCard from './components/HealthRecordCard';
import healthRecordsImage from '../../assets/healthRecords.png';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';

type Props = StackScreenProps<HealthStackParamList, 'HealthRecords'>;

const FILTER_TAB_KEYS = [
  { key: 'health.allRecords', value: null },
  { key: 'health.vaccines', value: 'Vaccine' },
  { key: 'health.vetVisits', value: 'Vet Appointment' },
  { key: 'health.medication', value: 'Medication' },
  { key: 'health.grooming', value: 'Pet Groomer' },
];

export default function HealthRecordsScreen({ navigation }: Props) {
  const { t } = useContext(LanguageContext);
  const { dogProfiles, selectedDog, userId, loadProfiles, handleSelectDog } = useDogProfiles();
  const { healthRecords, loadRecords, handleConfirmDelete, handleDeleteAll, stats } = useHealthRecords();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
      loadRecords();
    }, [selectedDog, userId])
  );

  const filteredRecords = activeFilter
    ? healthRecords.filter((r) => r.type === activeFilter)
    : healthRecords;

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
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

          <DogChipSelector
            dogProfiles={dogProfiles}
            selectedDogId={selectedDog?.id}
            onSelectDog={handleSelectDog}
          />

          {selectedDog && (
            <>
              <StatsCard>
                <StatsRow>
                  <StatCard>
                    <StatValue color="#41245c">{stats.totalRecords}</StatValue>
                    <StatLabel>{t('health.total')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#27ae60">{stats.vaccineCount}</StatValue>
                    <StatLabel>{t('health.vaccines')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#3498db">{stats.vetVisitCount}</StatValue>
                    <StatLabel>{t('health.visits')}</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue color="#e67e22">{stats.otherCount}</StatValue>
                    <StatLabel>{t('health.other')}</StatLabel>
                  </StatCard>
                </StatsRow>
              </StatsCard>

              <FilterTabs
                tabs={FILTER_TAB_KEYS}
                activeValue={activeFilter}
                onSelect={setActiveFilter}
                showScrollHint
                renderLabel={(tab) => t(tab.key)}
              />

              <AddButton
                onPress={() => navigation.navigate('AddHealthRecord', { onGoBack: () => loadRecords() })}
              >
                <AddButtonText>{t('health.addRecord')}</AddButtonText>
              </AddButton>

              {filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <HealthRecordCard
                    key={item.id}
                    item={item}
                    onDelete={handleConfirmDelete}
                    onPress={(r) => navigation.navigate('HealthRecordDetails', { record: r })}
                    t={t}
                  />
                ))
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

import React from 'react';
import { DotsThreeVertical } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogProfile } from '../../../types/dogProfile';
import { calculateDisplayAge } from '../../../utils/ageCalculation';
import {
  DogDetailCard, DogDetailHeader, DogDetailImage, DogDetailPlaceholder,
  DogDetailInfo, DogDetailName, DogDetailBreed, DogDetailMeta,
  EditDogButton, StatsRow, StatCard, StatValue, StatLabel,
} from '../styles';

interface DogDetailSectionProps {
  dog: DogProfile;
  healthCount: number;
  scheduledCount: number;
  monthExpenses: number;
  onEdit: () => void;
  onNavHealth: () => void;
  onNavExpenses: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export default function DogDetailSection({
  dog, healthCount, scheduledCount, monthExpenses,
  onEdit, onNavHealth, onNavExpenses, t,
}: DogDetailSectionProps) {
  return (
    <DogDetailCard>
      <DogDetailHeader>
        {dog.image ? (
          <DogDetailImage source={{ uri: dog.image }} />
        ) : (
          <DogDetailPlaceholder>
            <Icon name="dog" size={32} color="#41245c" />
          </DogDetailPlaceholder>
        )}
        <DogDetailInfo>
          <DogDetailName>{dog.name}</DogDetailName>
          <DogDetailBreed>
            {dog.breed}
            {dog.gender ? ` · ${dog.gender}` : ''}
          </DogDetailBreed>
          <DogDetailMeta>
            {calculateDisplayAge(dog, t)}
            {calculateDisplayAge(dog, t) && dog.weight ? '  ·  ' : ''}
            {dog.weight ? `${dog.weight} kg` : ''}
          </DogDetailMeta>
        </DogDetailInfo>
        <EditDogButton onPress={onEdit}>
          <DotsThreeVertical size={22} color="#999" weight="bold" />
        </EditDogButton>
      </DogDetailHeader>

      <StatsRow>
        <StatCard bgColor="#f0eff4" onPress={onNavHealth}>
          <StatValue color="#41245c">{healthCount}</StatValue>
          <StatLabel>{t('profile.petRecords')}</StatLabel>
        </StatCard>
        <StatCard bgColor="#e8ecf7" onPress={onNavHealth}>
          <StatValue color="#7289da">{scheduledCount}</StatValue>
          <StatLabel>{t('profile.upcoming')}</StatLabel>
        </StatCard>
        <StatCard bgColor="#e8f5e9" onPress={onNavExpenses}>
          <StatValue color="#2e7d32">${monthExpenses.toFixed(0)}</StatValue>
          <StatLabel>{t('profile.thisMonth')}</StatLabel>
        </StatCard>
      </StatsRow>
    </DogDetailCard>
  );
}

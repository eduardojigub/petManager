import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { getBadgeStyle } from '../../utils/badgeStyle';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG } from '../../constants/colors';
import { LanguageContext } from '../../context/LanguageContext';
import DetailRows from './components/DetailRows';
import {
  Container, ContentContainer, HeaderCard, HeaderIconContainer,
  RecordTitle, RecordType, StatusBadge, StatusBadgeText,
  DetailCard, EditButton, EditButtonText, BackButton, BackButtonText,
} from './styles';

type Props = StackScreenProps<HealthStackParamList, 'HealthRecordDetails'>;

export default function HealthRecordDetailsScreen({ route, navigation }: Props) {
  const { record } = route.params;
  const { t } = useContext(LanguageContext);
  const badge = getBadgeStyle(record, t);

  return (
    <Container>
      <ContentContainer>
        <HeaderCard>
          <HeaderIconContainer bgColor={HEALTH_TYPE_BG[record.type] || '#f0eff4'}>
            {getHealthScheduleIcon(record.type, 28, HEALTH_TYPE_COLOR[record.type] || '#41245c')}
          </HeaderIconContainer>
          <RecordTitle>{record.extraInfo || record.type}</RecordTitle>
          <RecordType>{record.type}</RecordType>
          <StatusBadge bgColor={badge.bg}>
            <StatusBadgeText color={badge.color}>{badge.label}</StatusBadgeText>
          </StatusBadge>
        </HeaderCard>

        <DetailCard>
          <DetailRows record={record} t={t} />
        </DetailCard>

        <EditButton
          onPress={() => navigation.navigate('AddHealthRecord', {
            isEditMode: true, record, onGoBack: () => navigation.goBack(),
          })}
        >
          <EditButtonText>{t('detail.editRecord')}</EditButtonText>
        </EditButton>

        <BackButton onPress={() => navigation.goBack()}>
          <BackButtonText>{t('detail.goBack')}</BackButtonText>
        </BackButton>
      </ContentContainer>
    </Container>
  );
}

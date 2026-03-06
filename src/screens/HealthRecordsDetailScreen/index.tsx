import React, { useContext } from 'react';
import {
  Container,
  ContentContainer,
  HeaderCard,
  HeaderIconContainer,
  RecordTitle,
  RecordType,
  StatusBadge,
  StatusBadgeText,
  DetailCard,
  DetailRow,
  DetailIconContainer,
  DetailInfo,
  DetailLabel,
  DetailValue,
  DetailImage,
  EditButton,
  EditButtonText,
  BackButton,
  BackButtonText,
} from './styles';
import {
  FileText,
  Calendar,
  CalendarCheck,
  Stethoscope,
  FirstAid,
  Scales,
  Barcode,
  Pill,
  Scissors,
  Bell,
  ImageSquare,
} from 'phosphor-react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { formatLongDate } from '../../utils/dateFormarter';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { LanguageContext } from '../../context/LanguageContext';

type Props = StackScreenProps<HealthStackParamList, 'HealthRecordDetails'>;

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

function getBadgeStyle(record: any, t: (key: string) => string): { bg: string; color: string; label: string } {
  if (!record.dueDate) {
    return { bg: '#e0f5e9', color: '#27ae60', label: t('health.complete') };
  }
  const now = new Date();
  const due = new Date(record.dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { bg: '#fdecea', color: '#e74c3c', label: t('health.expired') };
  if (diffDays <= 7) return { bg: '#fff3e0', color: '#e67e22', label: t('health.expiringSoon') };
  return { bg: '#e8f5e9', color: '#27ae60', label: t('health.active') };
}

export default function HealthRecordDetailsScreen({ route, navigation }: Props) {
  const { record } = route.params;
  const { t } = useContext(LanguageContext);
  const badge = getBadgeStyle(record, t);

  return (
    <Container>
      <ContentContainer>
        {/* Header */}
        <HeaderCard>
          <HeaderIconContainer bgColor={ICON_BG[record.type] || '#f0eff4'}>
            {getHealthScheduleIcon(record.type, 28, ICON_COLOR[record.type] || '#41245c')}
          </HeaderIconContainer>
          <RecordTitle>{record.extraInfo || record.type}</RecordTitle>
          <RecordType>{record.type}</RecordType>
          <StatusBadge bgColor={badge.bg}>
            <StatusBadgeText color={badge.color}>{badge.label}</StatusBadgeText>
          </StatusBadge>
        </HeaderCard>

        {/* Details */}
        <DetailCard>
          {/* Date */}
          <DetailRow>
            <DetailIconContainer>
              <Calendar size={18} color="#41245c" />
            </DetailIconContainer>
            <DetailInfo>
              <DetailLabel>{t('detail.date')}</DetailLabel>
              <DetailValue>{formatLongDate(record.date)}</DetailValue>
            </DetailInfo>
          </DetailRow>

          {/* Due Date */}
          {record.dueDate && (
            <DetailRow>
              <DetailIconContainer>
                <CalendarCheck size={18} color="#e67e22" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>
                  {record.type === 'Vaccine' ? t('detail.nextDoseDue') :
                   record.type === 'Medication' ? t('detail.endDate') :
                   record.type === 'Pet Groomer' ? t('detail.nextAppointment') : t('detail.dueDate')}
                </DetailLabel>
                <DetailValue>{formatLongDate(record.dueDate)}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Reminder */}
          {record.reminder && (
            <DetailRow>
              <DetailIconContainer>
                <Bell size={18} color="#7289da" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.reminder')}</DetailLabel>
                <DetailValue>
                  {record.reminderDays
                    ? t('detail.daysBefore', { count: String(record.reminderDays) })
                    : t('detail.notificationEnabled')}
                </DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Description */}
          {record.description ? (
            <DetailRow>
              <DetailIconContainer>
                <FileText size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.details')}</DetailLabel>
                <DetailValue>{record.description}</DetailValue>
              </DetailInfo>
            </DetailRow>
          ) : null}

          {/* Vet Appointment fields */}
          {record.vetName && (
            <DetailRow>
              <DetailIconContainer>
                <Stethoscope size={18} color="#3498db" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.vet')}</DetailLabel>
                <DetailValue>{record.vetName}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {record.clinicName && (
            <DetailRow>
              <DetailIconContainer>
                <FirstAid size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.clinic')}</DetailLabel>
                <DetailValue>{record.clinicName}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {record.visitWeight && (
            <DetailRow>
              <DetailIconContainer>
                <Scales size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.weightAtVisit')}</DetailLabel>
                <DetailValue>{record.visitWeight} kg</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Vaccine fields */}
          {record.batchNumber && (
            <DetailRow>
              <DetailIconContainer>
                <Barcode size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.batchNumber')}</DetailLabel>
                <DetailValue>{record.batchNumber}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Medication fields */}
          {record.dosage && (
            <DetailRow>
              <DetailIconContainer>
                <Pill size={18} color="#e67e22" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.dosage')}</DetailLabel>
                <DetailValue>{record.dosage}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {record.frequency && (
            <DetailRow>
              <DetailIconContainer>
                <Calendar size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.frequency')}</DetailLabel>
                <DetailValue>{record.frequency}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Pet Groomer fields */}
          {record.services && (
            <DetailRow>
              <DetailIconContainer>
                <Scissors size={18} color="#e91e63" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.services')}</DetailLabel>
                <DetailValue>{record.services}</DetailValue>
              </DetailInfo>
            </DetailRow>
          )}

          {/* Image */}
          {record.image ? (
            <DetailRow>
              <DetailIconContainer>
                <ImageSquare size={18} color="#41245c" />
              </DetailIconContainer>
              <DetailInfo>
                <DetailLabel>{t('detail.image')}</DetailLabel>
                <DetailImage source={{ uri: record.image }} />
              </DetailInfo>
            </DetailRow>
          ) : null}
        </DetailCard>

        {/* Actions */}
        <EditButton
          onPress={() =>
            navigation.navigate('AddHealthRecord', {
              isEditMode: true,
              record,
              onGoBack: () => navigation.goBack(),
            })
          }
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

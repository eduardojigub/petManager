import React from 'react';
import {
  FileText, Calendar, CalendarCheck, Stethoscope, FirstAid,
  Scales, Barcode, Pill, Scissors, Bell, ImageSquare, Clock, CheckCircle,
} from 'phosphor-react-native';
import { formatLongDate } from '../../../utils/dateFormarter';
import { formatTime } from '../../../utils/timeFormatting';
import { DetailRow, DetailIconContainer, DetailInfo, DetailLabel, DetailValue, DetailImage } from '../styles';

interface DetailRowsProps {
  record: any;
  t: (key: string, params?: Record<string, string>) => string;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <DetailRow>
      <DetailIconContainer>{icon}</DetailIconContainer>
      <DetailInfo>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value}</DetailValue>
      </DetailInfo>
    </DetailRow>
  );
}

export default function DetailRows({ record, t }: DetailRowsProps) {
  const isScheduled = record.status === 'scheduled';
  const dueDateLabel =
    record.type === 'Vaccine' ? t('detail.nextDoseDue') :
    record.type === 'Medication' ? t('detail.endDate') :
    record.type === 'Pet Groomer' ? t('detail.nextAppointment') : t('detail.dueDate');

  return (
    <>
      {isScheduled && (
        <Row icon={<CheckCircle size={18} color="#7289da" />}
          label={t('detail.status')} value={t('health.scheduled')} />
      )}

      <Row icon={<Calendar size={18} color="#41245c" />}
        label={t('detail.date')} value={formatLongDate(record.date)} />

      {isScheduled && record.time && (
        <Row icon={<Clock size={18} color="#7289da" />}
          label={t('detail.time')} value={formatTime(record.time)} />
      )}

      {record.dueDate && (
        <Row icon={<CalendarCheck size={18} color="#e67e22" />}
          label={dueDateLabel} value={formatLongDate(record.dueDate)} />
      )}

      {record.reminder && (
        <Row icon={<Bell size={18} color="#7289da" />}
          label={t('detail.reminder')}
          value={record.reminderDays
            ? t('detail.daysBefore', { count: String(record.reminderDays) })
            : t('detail.notificationEnabled')} />
      )}

      {record.description ? (
        <Row icon={<FileText size={18} color="#41245c" />}
          label={t('detail.details')} value={record.description} />
      ) : null}

      {record.vetName && (
        <Row icon={<Stethoscope size={18} color="#3498db" />}
          label={t('detail.vet')} value={record.vetName} />
      )}

      {record.clinicName && (
        <Row icon={<FirstAid size={18} color="#41245c" />}
          label={t('detail.clinic')} value={record.clinicName} />
      )}

      {record.visitWeight && (
        <Row icon={<Scales size={18} color="#41245c" />}
          label={t('detail.weightAtVisit')} value={`${record.visitWeight} kg`} />
      )}

      {record.batchNumber && (
        <Row icon={<Barcode size={18} color="#41245c" />}
          label={t('detail.batchNumber')} value={record.batchNumber} />
      )}

      {record.dosage && (
        <Row icon={<Pill size={18} color="#e67e22" />}
          label={t('detail.dosage')} value={record.dosage} />
      )}

      {record.frequency && (
        <Row icon={<Calendar size={18} color="#41245c" />}
          label={t('detail.frequency')} value={record.frequency} />
      )}

      {record.services && (
        <Row icon={<Scissors size={18} color="#e91e63" />}
          label={t('detail.services')} value={record.services} />
      )}

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
    </>
  );
}

import React from 'react';
import { Switch } from 'react-native';
import { CalendarBlank, Bell } from 'phosphor-react-native';
import {
  InputGroup, InputLabel, DateButton, DateButtonText,
  ReminderRow, ReminderLabel, ReminderDaysRow, ReminderDayChip, ReminderDayText,
  LabelRow, OptionalBadge,
} from '../styles';
import DatePickerField from '../../../components/DatePickerField';

interface DueDateSectionProps {
  type: string;
  dueDate: Date | null;
  setDueDate: (d: Date) => void;
  reminder: boolean;
  setReminder: (v: boolean) => void;
  reminderDays: number;
  setReminderDays: (d: number) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const DAYS_OPTIONS = [1, 3, 7, 14, 30];

export default function DueDateSection({
  type, dueDate, setDueDate, reminder, setReminder, reminderDays, setReminderDays, t,
}: DueDateSectionProps) {
  const dueDateLabels: Record<string, string> = {
    Vaccine: t('add.nextDoseDue'), Medication: t('add.endDate'),
    'Pet Groomer': t('add.nextAppointment'), 'Vet Appointment': t('add.nextVisit'),
  };
  const dueDatePlaceholders: Record<string, string> = {
    Vaccine: t('add.whenNextDose'), Medication: t('add.whenMedEnds'),
    'Pet Groomer': t('add.whenNextGrooming'), 'Vet Appointment': t('add.whenNextVisit'),
  };
  const label = dueDateLabels[type] || t('add.dueDate');
  const placeholder = dueDatePlaceholders[type] || t('add.selectDueDate');

  return (
    <>
      <InputGroup>
        <LabelRow>
          <InputLabel>{label}</InputLabel>
          <OptionalBadge>{t('add.optional')}</OptionalBadge>
        </LabelRow>
        <DatePickerField
          value={dueDate || new Date()}
          onChange={setDueDate}
          mode="date"
          label={placeholder}
          renderButton={(onPress, displayText) => (
            <DateButton onPress={onPress}>
              <CalendarBlank size={20} color="#e67e22" />
              <DateButtonText hasValue={!!dueDate}>
                {dueDate ? displayText : placeholder}
              </DateButtonText>
            </DateButton>
          )}
        />
      </InputGroup>

      {dueDate && (
        <InputGroup>
          <InputLabel>{t('add.reminder')}</InputLabel>
          <ReminderRow>
            <Bell size={20} color="#41245c" />
            <ReminderLabel>{t('add.remindBeforeExpires')}</ReminderLabel>
            <Switch
              value={reminder}
              onValueChange={setReminder}
              trackColor={{ false: '#ddd', true: '#7289da' }}
              thumbColor={reminder ? '#41245c' : '#f4f3f4'}
            />
          </ReminderRow>
          {reminder && (
            <>
              <InputLabel style={{ marginTop: 10 }}>{t('add.howManyDaysBefore')}</InputLabel>
              <ReminderDaysRow>
                {DAYS_OPTIONS.map((days) => (
                  <ReminderDayChip key={days} selected={reminderDays === days} onPress={() => setReminderDays(days)}>
                    <ReminderDayText selected={reminderDays === days}>
                      {days === 1 ? t('add.1dayChip') : t('add.daysChip', { count: String(days) })}
                    </ReminderDayText>
                  </ReminderDayChip>
                ))}
              </ReminderDaysRow>
            </>
          )}
        </InputGroup>
      )}
    </>
  );
}

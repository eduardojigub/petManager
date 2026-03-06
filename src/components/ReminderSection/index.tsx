import React from 'react';
import { Switch } from 'react-native';
import { Bell } from 'phosphor-react-native';
import {
  ReminderRow,
  ReminderLabel,
  ReminderChipsRow,
  ReminderChip,
  ReminderChipText,
} from './styles';

interface ReminderOption {
  key: string;
  minutes: number;
}

interface ReminderSectionProps {
  reminder: boolean;
  onReminderChange: (value: boolean) => void;
  options: ReminderOption[];
  selectedMinutes: number;
  onOptionSelect: (minutes: number) => void;
  label: string;
  howEarlyLabel: string;
  renderOptionLabel: (option: ReminderOption) => string;
}

export default function ReminderSection({
  reminder,
  onReminderChange,
  options,
  selectedMinutes,
  onOptionSelect,
  label,
  howEarlyLabel,
  renderOptionLabel,
}: ReminderSectionProps) {
  return (
    <>
      <ReminderRow>
        <Bell size={20} color="#41245c" />
        <ReminderLabel>{label}</ReminderLabel>
        <Switch
          value={reminder}
          onValueChange={onReminderChange}
          trackColor={{ false: '#ddd', true: '#7289da' }}
          thumbColor={reminder ? '#41245c' : '#f4f3f4'}
        />
      </ReminderRow>
      {reminder && (
        <>
          <ReminderLabel style={{ marginTop: 10 }}>{howEarlyLabel}</ReminderLabel>
          <ReminderChipsRow>
            {options.map((option) => (
              <ReminderChip
                key={option.minutes}
                selected={selectedMinutes === option.minutes}
                onPress={() => onOptionSelect(option.minutes)}
              >
                <ReminderChipText selected={selectedMinutes === option.minutes}>
                  {renderOptionLabel(option)}
                </ReminderChipText>
              </ReminderChip>
            ))}
          </ReminderChipsRow>
        </>
      )}
    </>
  );
}

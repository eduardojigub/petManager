import React from 'react';
import { FirstAidKit, CalendarPlus, CurrencyDollar } from 'phosphor-react-native';
import { QuickActionsTitle, QuickActionButton, QuickActionText } from '../styles';

interface QuickActionsProps {
  onAddRecord: () => void;
  onAddSchedule: () => void;
  onAddExpense: () => void;
  t: (key: string) => string;
}

export default function QuickActions({ onAddRecord, onAddSchedule, onAddExpense, t }: QuickActionsProps) {
  return (
    <>
      <QuickActionsTitle>{t('profile.quickActions')}</QuickActionsTitle>
      <QuickActionButton bgColor="#41245c" onPress={onAddRecord}>
        <FirstAidKit size={20} color="#fff" weight="bold" />
        <QuickActionText>{t('profile.addRecord')}</QuickActionText>
      </QuickActionButton>
      <QuickActionButton bgColor="#7289da" onPress={onAddSchedule}>
        <CalendarPlus size={20} color="#fff" weight="bold" />
        <QuickActionText>{t('profile.addAppointment')}</QuickActionText>
      </QuickActionButton>
      <QuickActionButton bgColor="#e67e22" onPress={onAddExpense}>
        <CurrencyDollar size={20} color="#fff" weight="bold" />
        <QuickActionText>{t('profile.addExpense')}</QuickActionText>
      </QuickActionButton>
    </>
  );
}

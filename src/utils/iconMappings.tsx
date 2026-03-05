import React from 'react';
import {
  Syringe,
  Stethoscope,
  Pill,
  Scissors,
  FileText,
  ForkKnife,
  PuzzlePiece,
} from 'phosphor-react-native';

const HEALTH_SCHEDULE_ICONS: Record<string, React.ComponentType<any>> = {
  Vaccine: Syringe,
  'Vet Appointment': Stethoscope,
  Medication: Pill,
  'Pet Groomer': Scissors,
  Other: FileText,
};

const EXPENSE_ICONS: Record<string, React.ComponentType<any>> = {
  Food: ForkKnife,
  Medical: Stethoscope,
  Toys: PuzzlePiece,
  Grooming: Scissors,
  Other: FileText,
};

export function getHealthScheduleIcon(
  type: string,
  size: number = 20,
  color: string = '#7289DA'
): React.ReactElement {
  const IconComponent = HEALTH_SCHEDULE_ICONS[type] || FileText;
  return <IconComponent size={size} color={color} />;
}

export function getExpenseIcon(
  type: string,
  size: number = 24,
  color: string = '#7289DA'
): React.ReactElement {
  const IconComponent = EXPENSE_ICONS[type] || FileText;
  return <IconComponent size={size} color={color} />;
}

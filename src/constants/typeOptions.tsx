import React from 'react';
import { TypeOption } from '../components/TypeSelector';
import { getHealthScheduleIcon, getExpenseIcon } from '../utils/iconMappings';

export const HEALTH_SCHEDULE_TYPES: TypeOption[] = [
  { label: 'Vaccine', icon: getHealthScheduleIcon('Vaccine') },
  { label: 'Vet Appointment', icon: getHealthScheduleIcon('Vet Appointment') },
  { label: 'Medication', icon: getHealthScheduleIcon('Medication') },
  { label: 'Pet Groomer', icon: getHealthScheduleIcon('Pet Groomer') },
  { label: 'Other', icon: getHealthScheduleIcon('Other') },
];

export const EXPENSE_TYPES: TypeOption[] = [
  { label: 'Food', icon: getExpenseIcon('Food') },
  { label: 'Medical', icon: getExpenseIcon('Medical') },
  { label: 'Grooming', icon: getExpenseIcon('Grooming') },
  { label: 'Toys', icon: getExpenseIcon('Toys') },
  { label: 'Other', icon: getExpenseIcon('Other') },
];

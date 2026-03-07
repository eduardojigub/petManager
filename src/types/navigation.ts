import { DogProfile } from './dogProfile';

export interface HealthRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  image?: string | null;
  dogId: string;
  extraInfo?: string;
  dueDate?: string | null;
  reminder?: boolean;
  reminderDays?: number | null;
  // Status: scheduled (future appointment) or completed (past record)
  status?: 'scheduled' | 'completed';
  // Scheduling fields (migrated from Schedule)
  time?: string | null;
  reminderMinutes?: number | null;
  pushNotification?: boolean;
  // Vet Appointment
  vetName?: string | null;
  clinicName?: string | null;
  visitWeight?: string | null;
  // Vaccine
  batchNumber?: string | null;
  // Medication
  dosage?: string | null;
  frequency?: string | null;
  // Pet Groomer
  services?: string | null;
  // Notification
  notificationId?: string | null;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  dogId: string;
  recurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly' | null;
}

export type AuthStackParamList = {
  Initial: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  EditProfile: DogProfile | undefined;
};

export type HealthStackParamList = {
  HealthRecords: { onGoBack?: () => void } | undefined;
  HealthRecordDetails: { record: HealthRecord };
  AddHealthRecord: {
    record?: HealthRecord;
    isEditMode?: boolean;
    addRecord?: (record: any) => void;
    onGoBack?: () => void;
    fromProfile?: boolean;
  };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditUserProfile: undefined;
  AccountSettings: undefined;
  Help: undefined;
};

export type AppTabsParamList = {
  HomeTab: undefined;
  Health: undefined;
  Expenses: {
    expense?: Expense;
  } | undefined;
  Settings: undefined;
};

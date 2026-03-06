import { DogProfile } from './dogProfile';

export interface HealthRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  image?: string | null;
  dogId: string;
  extraInfo?: string;
}

export interface Schedule {
  id: string;
  description: string;
  date: string;
  time: string;
  dogId: string;
  userId: string;
  notificationId?: string;
  type: string;
  pushNotification?: boolean;
  isUpcoming?: boolean;
  isPast?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  dogId: string;
}

export type AuthStackParamList = {
  Initial: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: DogProfile | undefined;
};

export type HealthStackParamList = {
  HealthRecords: { onGoBack?: () => void } | undefined;
  HealthRecordDetails: { record: HealthRecord; setIsFilterApplied: (value: boolean) => void };
  AddHealthRecord: {
    record?: HealthRecord;
    isEditMode?: boolean;
    addRecord?: (record: any) => void;
    onGoBack?: () => void;
  };
};

export type ScheduleStackParamList = {
  ScheduleScreen: undefined;
  AddSchedule: {
    schedule?: Schedule;
    isEditMode?: boolean;
  } | undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Account: undefined;
  EditUserProfile: undefined;
  ManageNotifications: undefined;
  AccountSettings: undefined;
  Help: undefined;
};

export type AppTabsParamList = {
  ProfileTab: undefined;
  Health: undefined;
  Schedule: undefined;
  Expenses: {
    expense?: Expense;
  } | undefined;
  Settings: undefined;
};

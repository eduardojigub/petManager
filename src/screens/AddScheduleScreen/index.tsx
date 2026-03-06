import React from 'react';
import { Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { CalendarBlank, Clock } from 'phosphor-react-native';
import {
  KeyboardAvoidingContainer,
  Container,
  ContentContainer,
  SectionTitle,
  FormCard,
  InputGroup,
  InputLabel,
  MultilineInput,
  DateButton,
  DateButtonText,
  SaveButton,
  SaveButtonText,
} from './styles';
import DatePickerField from '../../components/DatePickerField';
import TypeChipGrid from '../../components/TypeChipGrid';
import ReminderSection from '../../components/ReminderSection';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG } from '../../constants/colors';
import { useScheduleForm, REMINDER_OPTION_KEYS } from './hooks/useScheduleForm';
import { StackScreenProps } from '@react-navigation/stack';
import { ScheduleStackParamList } from '../../types/navigation';

type Props = StackScreenProps<ScheduleStackParamList, 'AddSchedule'>;

export default function AddScheduleScreen({ route, navigation }: Props) {
  const { schedule, isEditMode = false } = route.params || {};
  const {
    description, setDescription, date, setDate, time, setTime,
    type, setType, reminder, setReminder, reminderMinutes, setReminderMinutes,
    handleSave, t,
  } = useScheduleForm(schedule, isEditMode);

  const onSave = () => {
    handleSave(() => {
      if (route.params?.fromProfile) {
        navigation.navigate('ProfileTab' as any);
      } else {
        navigation.goBack();
      }
    });
  };

  return (
    <KeyboardAvoidingContainer behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ContentContainer>
            <SectionTitle>{t('add.selectType')}</SectionTitle>
            <TypeChipGrid
              types={HEALTH_SCHEDULE_TYPES}
              selectedType={type}
              onSelect={setType}
              getIcon={getHealthScheduleIcon}
              colorMap={HEALTH_TYPE_COLOR}
              bgMap={HEALTH_TYPE_BG}
            />

            {type ? (
              <>
                <FormCard>
                  <InputGroup>
                    <InputLabel>{t('add.description')}</InputLabel>
                    <MultilineInput
                      value={description}
                      onChangeText={setDescription}
                      placeholder={t('add.descriptionPlaceholder')}
                      placeholderTextColor="#ccc"
                      multiline
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.date')}</InputLabel>
                    <DatePickerField
                      value={date}
                      onChange={setDate}
                      mode="date"
                      label={t('add.selectDate')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <CalendarBlank size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.time')}</InputLabel>
                    <DatePickerField
                      value={time}
                      onChange={setTime}
                      mode="time"
                      label={t('add.selectTime')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <Clock size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{t('add.reminder')}</InputLabel>
                    <ReminderSection
                      reminder={reminder}
                      onReminderChange={setReminder}
                      options={REMINDER_OPTION_KEYS}
                      selectedMinutes={reminderMinutes}
                      onOptionSelect={setReminderMinutes}
                      label={t('add.remindBefore')}
                      howEarlyLabel={t('add.howEarly')}
                      renderOptionLabel={(opt) => t(opt.key)}
                    />
                  </InputGroup>
                </FormCard>

                <SaveButton onPress={onSave}>
                  <SaveButtonText>
                    {isEditMode ? t('add.updateSchedule') : t('add.saveSchedule')}
                  </SaveButtonText>
                </SaveButton>
              </>
            ) : null}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}

import React from 'react';
import { Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Switch } from 'react-native';
import { Question, CalendarBlank, Camera, Clock } from 'phosphor-react-native';
import {
  KeyboardAvoidingContainer, Container, ContentContainer, SectionTitle,
  FormCard, InputGroup, InputLabel, MultilineInput, DateButton, DateButtonText,
  ImageSection, ImagePreview, ImageButton, ImageButtonText,
  PlaceholderContainer, PlaceholderText, SaveButton, SaveButtonText,
  ReminderRow, ReminderLabel,
} from './styles';
import TypeChipGrid from '../../components/TypeChipGrid';
import DatePickerField from '../../components/DatePickerField';
import TypeSpecificFields from './components/TypeSpecificFields';
import DueDateSection from './components/DueDateSection';
import ReminderSection from '../../components/ReminderSection';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';
import { getHealthScheduleIcon } from '../../utils/iconMappings';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG } from '../../constants/colors';
import { useHealthRecordForm, REMINDER_OPTION_KEYS } from './hooks/useHealthRecordForm';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';

type Props = StackScreenProps<HealthStackParamList, 'AddHealthRecord'>;

export default function AddHealthRecordScreen({ navigation, route }: Props) {
  const { record } = route.params;
  const isEditMode = route.params?.isEditMode || false;
  const form = useHealthRecordForm(record);

  const onSave = () => {
    form.handleSave(isEditMode, () => {
      if (isEditMode) {
        if (route.params?.onGoBack) route.params.onGoBack();
        navigation.navigate('HealthRecords');
      } else {
        if (route.params?.addRecord) route.params.addRecord({});
        if (route.params?.onGoBack) route.params.onGoBack();
        navigation.goBack();
      }
    });
  };

  return (
    <KeyboardAvoidingContainer behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ContentContainer>
            <SectionTitle>{form.t('add.selectType')}</SectionTitle>
            <TypeChipGrid
              types={HEALTH_SCHEDULE_TYPES}
              selectedType={form.type}
              onSelect={form.setType}
              getIcon={getHealthScheduleIcon}
              colorMap={HEALTH_TYPE_COLOR}
              bgMap={HEALTH_TYPE_BG}
            />

            {!form.type && (
              <PlaceholderContainer>
                <Question size={40} color="#ccc" />
                <PlaceholderText>{form.t('add.selectTypePlaceholder')}</PlaceholderText>
              </PlaceholderContainer>
            )}

            {form.type && (
              <>
                <FormCard>
                  <TypeSpecificFields
                    type={form.type} extraInfo={form.extraInfo} setExtraInfo={form.setExtraInfo}
                    batchNumber={form.batchNumber} setBatchNumber={form.setBatchNumber}
                    dosage={form.dosage} setDosage={form.setDosage}
                    frequency={form.frequency} setFrequency={form.setFrequency}
                    vetName={form.vetName} setVetName={form.setVetName}
                    clinicName={form.clinicName} setClinicName={form.setClinicName}
                    visitWeight={form.visitWeight} handleWeightInput={form.handleWeightInput}
                    services={form.services} setServices={form.setServices}
                    t={form.t}
                  />

                  <InputGroup>
                    <InputLabel>{form.t('add.details')}</InputLabel>
                    <MultilineInput
                      value={form.description} onChangeText={form.setDescription}
                      placeholder={form.t('add.detailsPlaceholder')} placeholderTextColor="#ccc"
                      multiline returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{form.t('add.date')}</InputLabel>
                    <DatePickerField
                      value={form.date} onChange={form.setDate} mode="date" label={form.t('add.selectDate')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <CalendarBlank size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  {/* Schedule toggle */}
                  <InputGroup>
                    <InputLabel>{form.t('add.scheduleToggle')}</InputLabel>
                    <ReminderRow>
                      <Clock size={20} color="#7289da" />
                      <ReminderLabel>{form.t('add.scheduleToggle')}</ReminderLabel>
                      <Switch
                        value={form.isScheduled}
                        onValueChange={form.setIsScheduled}
                        trackColor={{ false: '#ddd', true: '#7289da' }}
                        thumbColor={form.isScheduled ? '#41245c' : '#f4f3f4'}
                      />
                    </ReminderRow>
                  </InputGroup>

                  {/* Scheduling fields */}
                  {form.isScheduled && (
                    <>
                      <InputGroup>
                        <InputLabel>{form.t('add.time')}</InputLabel>
                        <DatePickerField
                          value={form.time}
                          onChange={form.setTime}
                          mode="time"
                          label={form.t('add.selectTime')}
                          renderButton={(onPress, displayText) => (
                            <DateButton onPress={onPress}>
                              <Clock size={20} color="#41245c" />
                              <DateButtonText hasValue>{displayText}</DateButtonText>
                            </DateButton>
                          )}
                        />
                      </InputGroup>

                      <InputGroup>
                        <InputLabel>{form.t('add.reminder')}</InputLabel>
                        <ReminderSection
                          reminder={form.scheduleReminder}
                          onReminderChange={form.setScheduleReminder}
                          options={REMINDER_OPTION_KEYS}
                          selectedMinutes={form.reminderMinutes}
                          onOptionSelect={form.setReminderMinutes}
                          label={form.t('add.remindBefore')}
                          howEarlyLabel={form.t('add.howEarly')}
                          renderOptionLabel={(opt) => form.t(opt.key)}
                        />
                      </InputGroup>
                    </>
                  )}

                  {/* Due date section (only for completed records) */}
                  {!form.isScheduled && form.hasDueDate && (
                    <DueDateSection
                      type={form.type} dueDate={form.dueDate} setDueDate={form.setDueDate}
                      reminder={form.reminder} setReminder={form.setReminder}
                      reminderDays={form.reminderDays} setReminderDays={form.setReminderDays}
                      t={form.t}
                    />
                  )}

                  <ImageSection>
                    {form.image && <ImagePreview source={{ uri: form.image }} />}
                    <ImageButton onPress={form.handlePickImage}>
                      <Camera size={20} color="#41245c" />
                      <ImageButtonText>
                        {form.image ? form.t('add.changeImage') : form.t('add.addImage')}
                      </ImageButtonText>
                    </ImageButton>
                  </ImageSection>
                </FormCard>

                <SaveButton onPress={onSave} disabled={form.uploading}>
                  {form.uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <SaveButtonText>
                      {isEditMode ? form.t('add.updateRecord') : form.t('add.saveRecord')}
                    </SaveButtonText>
                  )}
                </SaveButton>
              </>
            )}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}

import React from 'react';
import { Keyboard, View } from 'react-native';
import { Dog, PawPrint, Scales, GenderMale, GenderFemale, CalendarBlank, Palette, Barcode } from 'phosphor-react-native';
import DatePickerField from '../../../components/DatePickerField';
import {
  FormCard, FormTitle, InputGroup, InputLabel, InputWithIcon, IconInput,
  UnitText, GenderRow, GenderChip, GenderChipText,
  DatePickerButton, DatePickerText, AgeDisplay, OptionalBadge,
} from '../styles';

interface ProfileFormFieldsProps {
  form: {
    name: string; setName: (v: string) => void;
    breed: string; setBreed: (v: string) => void;
    weight: string; handleWeightInput: (v: string) => void;
    gender: string; setGender: (v: string) => void;
    color: string; setColor: (v: string) => void;
    microchip: string; setMicrochip: (v: string) => void;
    birthday: Date | null; setBirthday: (v: Date) => void;
    isNewProfile: boolean;
    calculateAge: (birthday: Date, t: any) => string;
    t: (key: string, params?: Record<string, string>) => string;
  };
}

export default function ProfileFormFields({ form }: ProfileFormFieldsProps) {
  const { t } = form;

  return (
    <FormCard>
      <FormTitle>{form.isNewProfile ? t('editPet.addNew') : t('editPet.editProfile')}</FormTitle>

      <InputGroup>
        <InputLabel>{t('editPet.name')}</InputLabel>
        <InputWithIcon>
          <Dog size={22} color="#41245c" />
          <IconInput value={form.name} onChangeText={form.setName}
            placeholder={t('editPet.namePlaceholder')} placeholderTextColor="#ccc"
            maxLength={20} returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss} />
        </InputWithIcon>
      </InputGroup>

      <InputGroup>
        <InputLabel>{t('editPet.breed')}</InputLabel>
        <InputWithIcon>
          <PawPrint size={22} color="#41245c" />
          <IconInput value={form.breed} onChangeText={form.setBreed}
            placeholder={t('editPet.breedPlaceholder')} placeholderTextColor="#ccc"
            returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss} />
        </InputWithIcon>
      </InputGroup>

      <InputGroup>
        <InputLabel>{t('editPet.gender')}</InputLabel>
        <GenderRow>
          <GenderChip selected={form.gender === 'Male'}
            onPress={() => form.setGender(form.gender === 'Male' ? '' : 'Male')}>
            <GenderMale size={20} color={form.gender === 'Male' ? '#fff' : '#999'} weight="bold" />
            <GenderChipText selected={form.gender === 'Male'}>{t('editPet.male')}</GenderChipText>
          </GenderChip>
          <GenderChip selected={form.gender === 'Female'}
            onPress={() => form.setGender(form.gender === 'Female' ? '' : 'Female')}>
            <GenderFemale size={20} color={form.gender === 'Female' ? '#fff' : '#999'} weight="bold" />
            <GenderChipText selected={form.gender === 'Female'}>{t('editPet.female')}</GenderChipText>
          </GenderChip>
        </GenderRow>
      </InputGroup>

      <InputGroup>
        <InputLabel>{t('editPet.birthday')}</InputLabel>
        <DatePickerField
          value={form.birthday || new Date()} onChange={(date) => form.setBirthday(date)}
          mode="date" label={t('editPet.selectBirthday')}
          renderButton={(onPress, displayText) => (
            <DatePickerButton onPress={onPress}>
              <CalendarBlank size={22} color="#41245c" />
              <DatePickerText hasValue={!!form.birthday}>
                {form.birthday ? displayText : t('editPet.selectDateOfBirth')}
              </DatePickerText>
            </DatePickerButton>
          )}
        />
        {form.birthday && <AgeDisplay>{form.calculateAge(form.birthday, t)}</AgeDisplay>}
      </InputGroup>

      <InputGroup>
        <InputLabel>{t('editPet.weight')}</InputLabel>
        <InputWithIcon>
          <Scales size={22} color="#41245c" />
          <IconInput value={form.weight} onChangeText={form.handleWeightInput}
            placeholder={t('editPet.weightPlaceholder')} placeholderTextColor="#ccc"
            keyboardType="decimal-pad" returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss} />
          <UnitText>kg</UnitText>
        </InputWithIcon>
      </InputGroup>

      <InputGroup>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputLabel>{t('editPet.colorCoat')}</InputLabel>
          <OptionalBadge>{t('editPet.optional')}</OptionalBadge>
        </View>
        <InputWithIcon>
          <Palette size={22} color="#41245c" />
          <IconInput value={form.color} onChangeText={form.setColor}
            placeholder={t('editPet.colorPlaceholder')} placeholderTextColor="#ccc"
            returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss} />
        </InputWithIcon>
      </InputGroup>

      <InputGroup>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputLabel>{t('editPet.microchip')}</InputLabel>
          <OptionalBadge>{t('editPet.optional')}</OptionalBadge>
        </View>
        <InputWithIcon>
          <Barcode size={22} color="#41245c" />
          <IconInput value={form.microchip} onChangeText={form.setMicrochip}
            placeholder={t('editPet.microchipPlaceholder')} placeholderTextColor="#ccc"
            returnKeyType="done" blurOnSubmit onSubmitEditing={Keyboard.dismiss} />
        </InputWithIcon>
      </InputGroup>
    </FormCard>
  );
}

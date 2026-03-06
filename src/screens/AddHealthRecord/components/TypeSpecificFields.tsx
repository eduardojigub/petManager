import React from 'react';
import { Keyboard } from 'react-native';
import { Pill, Barcode, Stethoscope, Scales, FirstAid, Scissors, CalendarBlank } from 'phosphor-react-native';
import { InputGroup, InputLabel, InputWithIcon, StyledInput, LabelRow, OptionalBadge } from '../styles';

interface TypeSpecificFieldsProps {
  type: string;
  extraInfo: string;
  setExtraInfo: (v: string) => void;
  batchNumber: string;
  setBatchNumber: (v: string) => void;
  dosage: string;
  setDosage: (v: string) => void;
  frequency: string;
  setFrequency: (v: string) => void;
  vetName: string;
  setVetName: (v: string) => void;
  clinicName: string;
  setClinicName: (v: string) => void;
  visitWeight: string;
  handleWeightInput: (v: string) => void;
  services: string;
  setServices: (v: string) => void;
  t: (key: string) => string;
}

export default function TypeSpecificFields(props: TypeSpecificFieldsProps) {
  const { type, t } = props;
  const inputProps = { placeholderTextColor: '#ccc' as const, returnKeyType: 'done' as const, blurOnSubmit: true, onSubmitEditing: Keyboard.dismiss };

  if (type === 'Vaccine') {
    return (
      <>
        <InputGroup>
          <InputLabel>{t('add.vaccineName')}</InputLabel>
          <InputWithIcon>
            <Pill size={20} color="#27ae60" />
            <StyledInput value={props.extraInfo} onChangeText={props.setExtraInfo} placeholder={t('add.vaccineNamePlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.batchNumber')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <Barcode size={20} color="#41245c" />
            <StyledInput value={props.batchNumber} onChangeText={props.setBatchNumber} placeholder={t('add.batchNumberPlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
      </>
    );
  }

  if (type === 'Medication') {
    return (
      <>
        <InputGroup>
          <InputLabel>{t('add.medicationName')}</InputLabel>
          <InputWithIcon>
            <Pill size={20} color="#e67e22" />
            <StyledInput value={props.extraInfo} onChangeText={props.setExtraInfo} placeholder={t('add.medicationNamePlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.dosage')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <FirstAid size={20} color="#41245c" />
            <StyledInput value={props.dosage} onChangeText={props.setDosage} placeholder={t('add.dosagePlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.frequency')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <CalendarBlank size={20} color="#41245c" />
            <StyledInput value={props.frequency} onChangeText={props.setFrequency} placeholder={t('add.frequencyPlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
      </>
    );
  }

  if (type === 'Vet Appointment') {
    return (
      <>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.vetName')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <Stethoscope size={20} color="#3498db" />
            <StyledInput value={props.vetName} onChangeText={props.setVetName} placeholder={t('add.vetNamePlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.clinic')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <FirstAid size={20} color="#41245c" />
            <StyledInput value={props.clinicName} onChangeText={props.setClinicName} placeholder={t('add.clinicPlaceholder')} {...inputProps} />
          </InputWithIcon>
        </InputGroup>
        <InputGroup>
          <LabelRow><InputLabel>{t('add.weightAtVisit')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
          <InputWithIcon>
            <Scales size={20} color="#41245c" />
            <StyledInput value={props.visitWeight} onChangeText={props.handleWeightInput} placeholder={t('add.weightPlaceholder')} keyboardType="decimal-pad" {...inputProps} />
          </InputWithIcon>
        </InputGroup>
      </>
    );
  }

  if (type === 'Pet Groomer') {
    return (
      <InputGroup>
        <LabelRow><InputLabel>{t('add.services')}</InputLabel><OptionalBadge>{t('add.optional')}</OptionalBadge></LabelRow>
        <InputWithIcon>
          <Scissors size={20} color="#e91e63" />
          <StyledInput value={props.services} onChangeText={props.setServices} placeholder={t('add.servicesPlaceholder')} {...inputProps} />
        </InputWithIcon>
      </InputGroup>
    );
  }

  return null;
}

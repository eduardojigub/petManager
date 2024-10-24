import React from 'react';
import { NoteItemRow, IconCircle, DescriptionContainer, DescriptionText, SubtitleText, DetailsButton, DetailsButtonText } from './styles';
import { formatDateTime } from '../../../utils/dateFormarter';
import * as IconPhospor from 'phosphor-react-native';

const ScheduleItem = ({ schedule, onDetails }) => {
  const typeIcons = {
    Vaccine: <IconPhospor.Syringe size={32} color="#41245C" />,
    'Vet Appointment': <IconPhospor.Stethoscope size={32} color="#41245C" />,
    Medication: <IconPhospor.Pill size={32} color="#41245C" />,
    'Dog Groomer': <IconPhospor.Scissors size={32} color="#41245C" />,
    Other: <IconPhospor.FileText size={32} color="#41245C" />,
  };
  const icon = typeIcons[schedule.type] || typeIcons.Other;

  return (
    <NoteItemRow>
      <IconCircle>{icon}</IconCircle>
      <DescriptionContainer>
        <DescriptionText>{schedule.description}</DescriptionText>
        <SubtitleText>{formatDateTime(`${schedule.date} ${schedule.time}`)}</SubtitleText>
      </DescriptionContainer>
      <DetailsButton onPress={onDetails}>
        <DetailsButtonText>Details</DetailsButtonText>
      </DetailsButton>
    </NoteItemRow>
  );
};

export default ScheduleItem;

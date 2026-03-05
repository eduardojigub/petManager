import React from 'react';
import { Schedule } from '../../../types/navigation';
import { getHealthScheduleIcon } from '../../../utils/iconMappings';
import { formatDateTime } from '../../../utils/dateFormarter';
import {
  NoteItemRow,
  IconCircle,
  DescriptionContainer,
  DescriptionText,
  SubtitleText,
  DetailsButton,
  DetailsButtonText,
} from '../styles';

interface Props {
  schedule: Schedule;
  onViewDetails: (schedule: Schedule) => void;
}

export default function ScheduleItem({ schedule, onViewDetails }: Props) {
  return (
    <NoteItemRow>
      <IconCircle>{getHealthScheduleIcon(schedule.type, 32, '#41245C')}</IconCircle>
      <DescriptionContainer>
        <DescriptionText>{schedule.description}</DescriptionText>
        <SubtitleText>
          {formatDateTime(`${schedule.date} ${schedule.time}`)}
        </SubtitleText>
      </DescriptionContainer>
      <DetailsButton onPress={() => onViewDetails(schedule)}>
        <DetailsButtonText>Details</DetailsButtonText>
      </DetailsButton>
    </NoteItemRow>
  );
}

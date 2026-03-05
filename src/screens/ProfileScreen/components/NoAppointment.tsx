import React from 'react';
import { CalendarDots } from 'phosphor-react-native';
import {
  NoAppointmentContainer,
  CalendarIcon,
  NoAppointmentText,
} from '../styles';

export default function NoAppointment() {
  return (
    <NoAppointmentContainer>
      <CalendarIcon>
        <CalendarDots size={64} color="#000" weight="thin" />
      </CalendarIcon>
      <NoAppointmentText>No upcoming schedules for now.</NoAppointmentText>
    </NoAppointmentContainer>
  );
}

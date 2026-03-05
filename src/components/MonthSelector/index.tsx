import React from 'react';
import * as Icon from 'phosphor-react-native';
import { Container, ArrowButton, MonthTitle } from './styles';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface MonthSelectorProps {
  monthIndex: number;
  year: number;
  onChange: (monthIndex: number, year: number) => void;
}

export default function MonthSelector({
  monthIndex,
  year,
  onChange,
}: MonthSelectorProps) {
  const handleLeft = () => {
    let newMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    let newYear = monthIndex === 0 ? year - 1 : year;
    onChange(newMonth, newYear);
  };

  const handleRight = () => {
    let newMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    let newYear = monthIndex === 11 ? year + 1 : year;
    onChange(newMonth, newYear);
  };

  return (
    <Container>
      <ArrowButton onPress={handleLeft}>
        <Icon.CaretLeft size={24} color="#333" />
      </ArrowButton>
      <MonthTitle>{`${MONTHS[monthIndex]}, ${year}`}</MonthTitle>
      <ArrowButton onPress={handleRight}>
        <Icon.CaretRight size={24} color="#333" />
      </ArrowButton>
    </Container>
  );
}

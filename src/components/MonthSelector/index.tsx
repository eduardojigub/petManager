import React, { useContext } from 'react';
import * as Icon from 'phosphor-react-native';
import { Container, ArrowButton, MonthTitle } from './styles';
import { LanguageContext } from '../../context/LanguageContext';

const MONTH_KEYS = [
  'month.january', 'month.february', 'month.march', 'month.april',
  'month.may', 'month.june', 'month.july', 'month.august',
  'month.september', 'month.october', 'month.november', 'month.december',
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
  const { t } = useContext(LanguageContext);

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
        <Icon.CaretLeft size={20} color="#41245c" weight="bold" />
      </ArrowButton>
      <MonthTitle>{`${t(MONTH_KEYS[monthIndex])}, ${year}`}</MonthTitle>
      <ArrowButton onPress={handleRight}>
        <Icon.CaretRight size={20} color="#41245c" weight="bold" />
      </ArrowButton>
    </Container>
  );
}

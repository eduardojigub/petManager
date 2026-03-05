import React from 'react';
import * as Icon from 'phosphor-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLeft} style={styles.button}>
        <Icon.CaretLeft size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>{`${MONTHS[monthIndex]}, ${year}`}</Text>
      <TouchableOpacity onPress={handleRight} style={styles.button}>
        <Icon.CaretRight size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#41245C',
  },
});

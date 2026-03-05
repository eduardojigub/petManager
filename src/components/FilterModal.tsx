import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { X } from 'phosphor-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    type: string | null;
    month: number | null;
    year: number | null;
  }) => void;
  typeOptions: { label: string; value: string | null }[];
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  typeOptions,
}: FilterModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const currentMonth = new Date().getMonth();

  const months = Array.from({ length: 12 }, (_, index) => ({
    label:
      index === currentMonth
        ? `${new Date(2023, index).toLocaleString('default', {
            month: 'long',
          })} (Current Month)`
        : new Date(2023, index).toLocaleString('default', { month: 'long' }),
    value: index,
  }));

  const years = Array.from({ length: 10 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { label: `${year}`, value: year };
  });

  const hasActiveFilters =
    selectedType !== null || selectedMonth !== null || selectedYear !== null;

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const handleClose = () => {
    clearFilters();
    onClose();
  };

  const handleApply = () => {
    onApply({
      type: selectedType,
      month: selectedMonth,
      year: selectedYear,
    });
    clearFilters();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Health Records</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={32} />
            </TouchableOpacity>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Filter by Type</Text>
            <View style={styles.dropdownWrapper}>
              <Dropdown
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Type"
                value={selectedType}
                onChange={(item) => setSelectedType(item.value)}
              />
            </View>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Filter by Month</Text>
            <View style={styles.dropdownWrapper}>
              <Dropdown
                data={months}
                labelField="label"
                valueField="value"
                placeholder="Select Month"
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </View>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Filter by Year</Text>
            <View style={styles.dropdownWrapper}>
              <Dropdown
                data={years}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                onChange={(item) => setSelectedYear(item.value)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.applyButton,
              { opacity: hasActiveFilters ? 1 : 0.5 },
            ]}
            onPress={handleApply}
            disabled={!hasActiveFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#41245C',
  },
  closeButton: {
    padding: 4,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 6,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
  },
  applyButton: {
    backgroundColor: '#7289DA',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});

import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { X } from 'phosphor-react-native';
import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  CloseButton,
  DropdownContainer,
  DropdownLabel,
  DropdownWrapper,
  ApplyButton,
  ApplyButtonText,
} from './styles';

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
      <Overlay>
        <ModalContainer>
          <Header>
            <Title>Filter Health Records</Title>
            <CloseButton onPress={handleClose}>
              <X size={32} />
            </CloseButton>
          </Header>

          <DropdownContainer>
            <DropdownLabel>Filter by Type</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Type"
                value={selectedType}
                onChange={(item) => setSelectedType(item.value)}
              />
            </DropdownWrapper>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownLabel>Filter by Month</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={months}
                labelField="label"
                valueField="value"
                placeholder="Select Month"
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </DropdownWrapper>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownLabel>Filter by Year</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={years}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                onChange={(item) => setSelectedYear(item.value)}
              />
            </DropdownWrapper>
          </DropdownContainer>

          <ApplyButton
            hasActiveFilters={hasActiveFilters}
            onPress={handleApply}
            disabled={!hasActiveFilters}
          >
            <ApplyButtonText>Apply Filter</ApplyButtonText>
          </ApplyButton>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
}

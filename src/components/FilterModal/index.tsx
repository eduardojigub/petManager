import React, { useContext, useState } from 'react';
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
import { LanguageContext } from '../../context/LanguageContext';

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
  const { t, locale } = useContext(LanguageContext);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const currentMonth = new Date().getMonth();

  const monthKeys = [
    'month.january', 'month.february', 'month.march', 'month.april',
    'month.may', 'month.june', 'month.july', 'month.august',
    'month.september', 'month.october', 'month.november', 'month.december',
  ];

  const months = Array.from({ length: 12 }, (_, index) => ({
    label: index === currentMonth
      ? `${t(monthKeys[index])} ${t('filter.currentMonth')}`
      : t(monthKeys[index]),
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
            <Title>{t('filter.title')}</Title>
            <CloseButton onPress={handleClose}>
              <X size={32} />
            </CloseButton>
          </Header>

          <DropdownContainer>
            <DropdownLabel>{t('filter.byType')}</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder={t('filter.selectType')}
                value={selectedType}
                onChange={(item) => setSelectedType(item.value)}
              />
            </DropdownWrapper>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownLabel>{t('filter.byMonth')}</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={months}
                labelField="label"
                valueField="value"
                placeholder={t('filter.selectMonth')}
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </DropdownWrapper>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownLabel>{t('filter.byYear')}</DropdownLabel>
            <DropdownWrapper>
              <Dropdown
                data={years}
                labelField="label"
                valueField="value"
                placeholder={t('filter.selectYear')}
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
            <ApplyButtonText>{t('filter.apply')}</ApplyButtonText>
          </ApplyButton>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
}

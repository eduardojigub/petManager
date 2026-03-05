import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ButtonRow,
  ActionText,
} from './styles';

interface DatePickerFieldProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time';
  label?: string;
  renderButton: (onPress: () => void, displayText: string) => React.ReactNode;
}

export default function DatePickerField({
  value,
  onChange,
  mode = 'date',
  label = 'Select Date',
  renderButton,
}: DatePickerFieldProps) {
  const [showModal, setShowModal] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const displayText =
    mode === 'date'
      ? value.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : value.toLocaleTimeString();

  const handleOpen = () => {
    setTempValue(value);
    setShowModal(true);
  };

  if (Platform.OS === 'ios') {
    return (
      <>
        {renderButton(handleOpen, displayText)}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>{label}</ModalTitle>
              <DateTimePicker
                value={tempValue}
                mode={mode}
                display="default"
                onChange={(event, selectedValue) => {
                  if (selectedValue) setTempValue(selectedValue);
                }}
              />
              <ButtonRow>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <ActionText>Cancel</ActionText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onChange(tempValue);
                    setShowModal(false);
                  }}
                >
                  <ActionText>Confirm</ActionText>
                </TouchableOpacity>
              </ButtonRow>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    );
  }

  // Android: direct picker
  return (
    <>
      {renderButton(handleOpen, displayText)}
      {showModal && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={(event, selectedValue) => {
            setShowModal(false);
            if (selectedValue) onChange(selectedValue);
          }}
        />
      )}
    </>
  );
}

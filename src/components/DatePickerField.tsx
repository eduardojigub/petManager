import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '90%',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                {label}
              </Text>
              <DateTimePicker
                value={tempValue}
                mode={mode}
                display="default"
                onChange={(event, selectedValue) => {
                  if (selectedValue) setTempValue(selectedValue);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={{ color: '#7289DA', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onChange(tempValue);
                    setShowModal(false);
                  }}
                >
                  <Text style={{ color: '#7289DA', fontSize: 16 }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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

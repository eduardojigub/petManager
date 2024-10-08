import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import { AlertButton, AlertContainer, AlertIcon, AlertMessage, AlertTitle, ButtonText, Overlay } from './styles';

export default function CustomAlert({ visible, onClose, iconName = 'alert-circle', title, message }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Overlay>
        <AlertContainer>
          <AlertIcon>
            <Icon name={iconName} size={40} color="#D81E5B" />
          </AlertIcon>
          <AlertTitle>{title}</AlertTitle>
          <AlertMessage>{message}</AlertMessage>
          <AlertButton onPress={onClose}>
            <ButtonText>Done</ButtonText>
          </AlertButton>
        </AlertContainer>
      </Overlay>
    </Modal>
  );
}

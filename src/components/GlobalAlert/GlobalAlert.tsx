import React, { useContext } from 'react';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AlertButton, AlertContainer, AlertIcon, AlertMessage, AlertTitle, ButtonText, Overlay } from './styles';
import { LanguageContext } from '../../context/LanguageContext';

export default function CustomAlert({ visible, onClose, iconName = 'alert-circle', title, message }) {
  const { t } = useContext(LanguageContext);

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
            <ButtonText>{t('common.done')}</ButtonText>
          </AlertButton>
        </AlertContainer>
      </Overlay>
    </Modal>
  );
}

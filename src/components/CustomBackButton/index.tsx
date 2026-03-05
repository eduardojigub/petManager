import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackButtonContainer } from './styles';

interface CustomBackButtonProps {
  onPress?: () => void;
}

const CustomBackButton: React.FC<CustomBackButtonProps> = ({ onPress }) => (
  <BackButtonContainer onPress={onPress}>
    <Icon name="chevron-left" size={20} color="#000" />
  </BackButtonContainer>
);

export default CustomBackButton;

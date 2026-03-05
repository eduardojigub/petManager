import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomBackButtonProps {
  onPress?: () => void;
}

const CustomBackButton: React.FC<CustomBackButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#D1D1D1',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    }}
  >
    <Icon name="chevron-left" size={20} color="#000" />
  </TouchableOpacity>
);

export default CustomBackButton;

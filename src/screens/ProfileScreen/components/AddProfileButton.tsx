import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddProfileCircle } from '../styles';

interface Props {
  onPress: () => void;
}

export default function AddProfileButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <AddProfileCircle>
        <Icon name="plus" size={40} color="#41245C" />
      </AddProfileCircle>
    </TouchableOpacity>
  );
}

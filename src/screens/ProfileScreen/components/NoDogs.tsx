import React from 'react';
import { PawPrint } from 'phosphor-react-native';
import { NoDogsContainer, NoDogsText } from '../styles';
import AddProfileButton from './AddProfileButton';

interface Props {
  onAddProfile: () => void;
}

export default function NoDogs({ onAddProfile }: Props) {
  return (
    <NoDogsContainer>
      <PawPrint size={64} color="#41245C" weight="thin" />
      <NoDogsText>No pet profiles added. Start by creating one!</NoDogsText>
      <AddProfileButton onPress={onAddProfile} />
    </NoDogsContainer>
  );
}

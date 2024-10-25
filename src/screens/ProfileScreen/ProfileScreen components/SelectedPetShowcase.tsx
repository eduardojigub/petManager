import React, { useEffect } from 'react';
import {
  DogImageBackground,
  GradientOverlay,
  DogDetailsContainer,
  DogInfo,
  DogInfoText,
  DogInfoRow,
  InfoText,
  BulletPoint,
  EditButton,
  EditButtonText,
  PlaceholderBackground,
} from '../styles';
import { useNavigation } from '@react-navigation/native';
import usePetContext from '../../../context/PetContext';

import { ActivityIndicator } from 'react-native';

/**
 * Displays the details of a pet profile, including a photo, name, age, weight, and breed.
 * If no photo is available, a placeholder is shown.
 * @param {PetProfile} selectedPet - The selected pet profile to display.
 * @returns {JSX.Element} - The selected pet showcase component.
 */
const SelectedPetShowcase = (): JSX.Element => {
  const navigation = useNavigation();
  const { selectedPet } = usePetContext();
  console.log(selectedPet);

  useEffect
  if (!selectedPet) {
    return <ActivityIndicator
    size="large"
    color="#41245C"
    style={{ marginVertical: 20 }}
  />
  }


  const PetInfoContent = () => (
    <DogDetailsContainer>
      <DogInfo>
        <DogInfoText>{selectedPet.name}</DogInfoText>
        <DogInfoRow>
          <InfoText>{selectedPet.age} years</InfoText>
          <BulletPoint>•</BulletPoint>
          <InfoText>{selectedPet.weight} kg</InfoText>
        </DogInfoRow>
        <DogInfoText>{selectedPet.breed}</DogInfoText>
      </DogInfo>
      <EditButton onPress={() => navigation.navigate('EditProfile', { selectedPet })}>
        <EditButtonText>Edit Profile</EditButtonText>
      </EditButton>
    </DogDetailsContainer>
  );

  return (
    <>
      {selectedPet.image ? (
        <DogImageBackground source={{ uri: selectedPet.image }}>
          <GradientOverlay>
            <PetInfoContent />
          </GradientOverlay>
        </DogImageBackground>
      ) : (
        <PlaceholderBackground>
          <PetInfoContent />
        </PlaceholderBackground>
      )}
    </>
  );
};

export default SelectedPetShowcase;

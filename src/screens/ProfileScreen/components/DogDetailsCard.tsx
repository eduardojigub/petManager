import React from 'react';
import { DogProfile } from '../../../types/dogProfile';
import {
  SelectedDogSection,
  DogImageBackground,
  GradientOverlay,
  PlaceholderBackground,
  DogDetailsContainer,
  DogInfo,
  DogInfoText,
  DogInfoRow,
  InfoText,
  BulletPoint,
  EditButton,
  EditButtonText,
} from '../styles';

interface Props {
  dog: DogProfile;
  onEdit: (dog: DogProfile) => void;
}

function DogDetails({ dog, onEdit }: Props) {
  return (
    <DogDetailsContainer>
      <DogInfo>
        <DogInfoText>{dog.name}</DogInfoText>
        <DogInfoRow>
          <InfoText>{dog.age} years</InfoText>
          <BulletPoint>•</BulletPoint>
          <InfoText>{dog.weight} kg</InfoText>
        </DogInfoRow>
        <DogInfoText>{dog.breed}</DogInfoText>
      </DogInfo>
      <EditButton onPress={() => onEdit(dog)}>
        <EditButtonText>Edit Profile</EditButtonText>
      </EditButton>
    </DogDetailsContainer>
  );
}

export default function DogDetailsCard({ dog, onEdit }: Props) {
  return (
    <SelectedDogSection>
      {dog.image ? (
        <DogImageBackground source={{ uri: dog.image }}>
          <GradientOverlay>
            <DogDetails dog={dog} onEdit={onEdit} />
          </GradientOverlay>
        </DogImageBackground>
      ) : (
        <PlaceholderBackground>
          <DogDetails dog={dog} onEdit={onEdit} />
        </PlaceholderBackground>
      )}
    </SelectedDogSection>
  );
}

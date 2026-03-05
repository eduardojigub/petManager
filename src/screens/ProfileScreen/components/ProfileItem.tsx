import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogProfile } from '../../../types/dogProfile';
import {
  ProfileItemWrapper,
  ProfileItemContent,
  ProfileImage,
  ProfilePlaceholder,
  ProfileName,
} from '../styles';

interface Props {
  dog: DogProfile;
  onSelect: (dog: DogProfile) => void;
}

export default function ProfileItem({ dog, onSelect }: Props) {
  return (
    <ProfileItemWrapper onPress={() => onSelect(dog)}>
      <ProfileItemContent>
        {dog.image ? (
          <ProfileImage source={{ uri: dog.image }} />
        ) : (
          <ProfilePlaceholder>
            <Icon name="dog" size={32} color="#ffffff" />
          </ProfilePlaceholder>
        )}
        <ProfileName>{dog.name}</ProfileName>
      </ProfileItemContent>
    </ProfileItemWrapper>
  );
}

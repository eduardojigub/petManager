import React from 'react';
import { FlatList } from 'react-native';
import { DogProfile } from '../../types/dogProfile';
import {
  DogChipsRow,
  DogChip,
  DogChipImage,
  DogChipPlaceholder,
  DogChipPlaceholderText,
  DogChipText,
} from './styles';

interface DogChipSelectorProps {
  dogProfiles: DogProfile[];
  selectedDogId?: string;
  onSelectDog: (dog: DogProfile) => void;
  footerComponent?: React.ReactElement;
}

export default function DogChipSelector({
  dogProfiles,
  selectedDogId,
  onSelectDog,
  footerComponent,
}: DogChipSelectorProps) {
  if (dogProfiles.length === 0) return null;

  return (
    <DogChipsRow>
      <FlatList
        horizontal
        data={dogProfiles}
        renderItem={({ item }) => {
          const isSelected = selectedDogId === item.id;
          return (
            <DogChip selected={isSelected} onPress={() => onSelectDog(item)}>
              {item.image ? (
                <DogChipImage source={{ uri: item.image }} />
              ) : (
                <DogChipPlaceholder>
                  <DogChipPlaceholderText>
                    {item.name.charAt(0)}
                  </DogChipPlaceholderText>
                </DogChipPlaceholder>
              )}
              <DogChipText selected={isSelected}>{item.name}</DogChipText>
            </DogChip>
          );
        }}
        keyExtractor={(item) => item.id}
        ListFooterComponent={footerComponent}
        showsHorizontalScrollIndicator={false}
      />
    </DogChipsRow>
  );
}

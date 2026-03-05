import React from 'react';
import { View } from 'react-native';

export interface TypeOption {
  label: string;
  icon: React.ReactNode;
}

interface TypeSelectorProps {
  types: TypeOption[];
  selected: string;
  onSelect: (label: string) => void;
  renderOption: (
    item: TypeOption,
    isSelected: boolean,
    onPress: () => void
  ) => React.ReactNode;
}

export default function TypeSelector({
  types,
  selected,
  onSelect,
  renderOption,
}: TypeSelectorProps) {
  return (
    <>
      {types.map((item) =>
        renderOption(item, selected === item.label, () => onSelect(item.label))
      )}
    </>
  );
}

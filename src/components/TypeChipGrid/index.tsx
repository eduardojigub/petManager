import React from 'react';
import { TypeGrid, TypeChip, TypeChipText } from './styles';

interface TypeChipGridProps {
  types: { label: string }[];
  selectedType: string;
  onSelect: (label: string) => void;
  getIcon: (label: string, size: number, color: string) => React.ReactElement;
  colorMap: Record<string, string>;
  bgMap: Record<string, string>;
}

export default function TypeChipGrid({
  types,
  selectedType,
  onSelect,
  getIcon,
  colorMap,
  bgMap,
}: TypeChipGridProps) {
  return (
    <TypeGrid>
      {types.map((item) => {
        const isSelected = selectedType === item.label;
        const color = colorMap[item.label] || '#41245c';
        const bg = bgMap[item.label] || '#f0eff4';
        return (
          <TypeChip
            key={item.label}
            selected={isSelected}
            selectedBg={bg}
            onPress={() => onSelect(item.label)}
          >
            {getIcon(item.label, 20, color)}
            <TypeChipText selected={isSelected} selectedColor={color}>
              {item.label}
            </TypeChipText>
          </TypeChip>
        );
      })}
    </TypeGrid>
  );
}

import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Container, EmptyImage, EmptyText } from './styles';

interface EmptyStateListProps {
  image: ImageSourcePropType;
  text: string;
}

export default function EmptyStateList({ image, text }: EmptyStateListProps) {
  return (
    <Container>
      <EmptyImage source={image} resizeMode="contain" />
      <EmptyText>{text}</EmptyText>
    </Container>
  );
}

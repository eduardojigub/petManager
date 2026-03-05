import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface EmptyStateListProps {
  image: ImageSourcePropType;
  text: string;
}

export default function EmptyStateList({ image, text }: EmptyStateListProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});

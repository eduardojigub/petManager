import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
};

/**
 * Pads a headerless screen below the status bar without putting that padding
 * inside the scroll content, so lists cannot scroll back under the status bar.
 * The existing in-content spacing stays as it is.
 */
export default function HeaderlessInset({
  children,
  backgroundColor = '#f8f8f8',
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fill, { paddingTop: insets.top, backgroundColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

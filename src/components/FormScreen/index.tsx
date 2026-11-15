import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useBottomInsetOutsideTabBar } from '../../hooks/useBottomInsetOutsideTabBar';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  contentContainerStyle?: ViewStyle;
};

/**
 * Keeps the focused field above the keyboard on Android and iOS.
 * react-native-keyboard-controller reads IME insets. React Native 0.79's
 * KeyboardAvoidingView does not, once edge-to-edge stops adjustResize from
 * shrinking the window.
 */
export default function FormScreen({
  children,
  backgroundColor = '#fff',
  contentContainerStyle,
}: Props) {
  const bottomInset = useBottomInsetOutsideTabBar();

  return (
    <KeyboardAwareScrollView
      style={[styles.fill, { backgroundColor }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomInset },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      bottomOffset={24}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

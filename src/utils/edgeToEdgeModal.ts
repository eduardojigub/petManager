import { ModalProps, Platform } from 'react-native';

/** Lets a React Native modal cover the status and navigation bars on Android edge-to-edge. */
export const edgeToEdgeModalProps: Pick<
  ModalProps,
  'statusBarTranslucent' | 'navigationBarTranslucent'
> =
  Platform.OS === 'android'
    ? { statusBarTranslucent: true, navigationBarTranslucent: true }
    : {};

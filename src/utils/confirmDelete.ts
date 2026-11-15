import { Alert } from 'react-native';

interface ConfirmDeleteOptions {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  cancelable?: boolean;
}

export function confirmDelete({
  title,
  message,
  onConfirm,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  destructive = true,
  cancelable = true,
}: ConfirmDeleteOptions): void {
  Alert.alert(
    title,
    message,
    [
      { text: cancelText, style: 'cancel' },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ],
    { cancelable }
  );
}

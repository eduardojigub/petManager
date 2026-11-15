import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavNode = {
  getState?: () => { type?: string } | undefined;
  getParent?: () => NavNode | undefined;
};

/**
 * Bottom system inset for screens that are not already sitting above the tab bar.
 * The tab bar consumes that inset itself, so adding it again would double the gap on iOS.
 */
export function useBottomInsetOutsideTabBar(): number {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation() as NavNode;
  let current: NavNode | undefined = navigation;

  while (current) {
    if (current.getState?.()?.type === 'tab') {
      return 0;
    }
    current = current.getParent?.();
  }

  return insets.bottom;
}

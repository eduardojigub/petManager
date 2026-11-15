import { useState } from 'react';

/**
 * Clears cached screen data during render when the selected id changes,
 * so the previous pet's records are not painted under the new selection.
 */
export function useClearOnIdChange(
  id: string | null | undefined,
  clear: () => void,
): void {
  const [seenId, setSeenId] = useState(id);
  if (seenId !== id) {
    setSeenId(id);
    clear();
  }
}

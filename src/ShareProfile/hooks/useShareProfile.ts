import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { View } from 'react-native';
import { shareProfileImage } from '../services/profileImageSharing';

export function useShareProfile() {
  const [isSharing, setIsSharing] = useState(false);

  const shareProfile = useCallback(
    async (cardRef: RefObject<View | null>) => {
      setIsSharing(true);

      try {
        await shareProfileImage(cardRef);
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  return {
    shareProfile,
    isSharing,
  };
}
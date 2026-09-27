import { RefObject } from 'react';
import { Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export async function shareProfileImage(
  cardRef: RefObject<View | null>
): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('SHARING_NOT_SUPPORTED_ON_WEB');
  }

  if (!cardRef.current) {
    throw new Error('SHARE_CARD_NOT_READY');
  }

  const sharingAvailable = await Sharing.isAvailableAsync();

  if (!sharingAvailable) {
    throw new Error('SHARING_NOT_AVAILABLE');
  }

  const capturedUri = await captureRef(cardRef.current, {
    format: 'jpg',
    quality: 0.9,
    width: 1080,
    height: 1920,
    result: 'tmpfile',
  });

  const shareUri =
    capturedUri.startsWith('file://') ||
    capturedUri.startsWith('content://')
      ? capturedUri
      : `file://${capturedUri}`;

  await Sharing.shareAsync(shareUri, {
    mimeType: 'image/jpeg',
    dialogTitle: 'Compartir mi TopFive',
    UTI: 'public.jpeg',
  });
}
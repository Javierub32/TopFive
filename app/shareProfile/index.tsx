import { View } from 'react-native';
import { Screen } from 'components/Screen';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ShareProfileCard } from 'src/ShareProfile/components/ShareProfileCard';
import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTopFive } from 'src/Profile/hooks/useTopFive';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useShareProfile } from 'src/ShareProfile/hooks/useShareProfile';

export default function ShareProfileScreen() {
  const { userData, loading: profileLoading } = useProfile();

  const { topFiveItems, loading: topFiveLoading } = useTopFive(userData?.id || '');

  const { autoShare } = useLocalSearchParams<{
    autoShare?: string;
  }>();

  const cardRef = useRef<View | null>(null);
  const startedRef = useRef(false);
  const [cardReady, setCardReady] = useState(false);

  const { shareProfile } = useShareProfile();

  useEffect(() => {
    if (
      autoShare !== 'true' ||
      profileLoading ||
      topFiveLoading ||
      !userData ||
      !cardReady ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    const shareAutomatically = async () => {
      try {
        const imageUrls = topFiveItems
          .map((item) => item.resourceData?.contenido?.imagenUrl)
          .filter(Boolean) as string[];

        await Promise.all(imageUrls.map((url) => Image.prefetch(url)));

        await shareProfile(cardRef);
      } catch (error) {
        console.error('Error compartiendo el TopFive:', error);
      } finally {
        router.back();
      }
    };

    const timeout = setTimeout(shareAutomatically, 250);

    return () => clearTimeout(timeout);
  }, [autoShare, profileLoading, topFiveLoading, userData, cardReady, topFiveItems, shareProfile]);

  if (profileLoading || topFiveLoading || !userData) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <View
        onLayout={() => setCardReady(true)}
        style={{
          width: 360,
          height: 640,
        }}>
        <ShareProfileCard
          ref={cardRef}
          username={userData.username}
          topFiveItems={topFiveItems}
        />
      </View>
    </Screen>
  );
}

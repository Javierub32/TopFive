import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFrame } from '@/Frames/hook/useFrame';
import { useNotification } from 'context/NotificationContext';

import { RewardedAd, RewardedAdEventType, AdEventType,TestIds } from 'lib/rewarderAd';

import { UserAvatar } from '@/User/components/UserAvatar';
import { useProfile } from '@/Profile/hooks/useProfile';
const availableFrames = ['none', 'libro', 'pelicula', 'cancion', 'videojuego', 'love'];

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'android'
    ? 'ca-app-pub-2120812527357725/6252066273'
    : 'ca-app-pub-2120812527357725/6787252895';

export default function FrameSelectorScreen() {
  const { avatarUrl, currentFrame } = useLocalSearchParams<{
    avatarUrl?: string;
    currentFrame?: string;
  }>();

  const [selectedFrame, setSelectedFrame] = useState(currentFrame || 'none');
  const { colors } = useTheme();
  const { loading, saving, handleSaveFrame, userFrames, unlockFrame } = useFrame();
  const { showNotification } = useNotification();
  const { pickImage, userData } = useProfile();

  const currentAvatarUrl = userData?.avatar_url || avatarUrl;

  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const frameToUnlockRef = useRef<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      // El usuario ha visto el anuncio completo, desbloqueamos el marco guardado en la referencia
      if (frameToUnlockRef.current) {
        unlockFrame(frameToUnlockRef.current);
      }
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsWatchingAd(false);
      setAdLoaded(false);
      ad.load(); // Cargamos el siguiente anuncio en segundo plano
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsWatchingAd(false);
      setAdLoaded(false);
      console.error('Error cargando el anuncio:', error);

      // Guardamos la referencia del timeout
      retryTimeoutRef.current = setTimeout(() => {
        ad.load();
      }, 5000);
    });

    ad.load();
    setRewardedAd(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const renderAvatar = (url: string | null | undefined, frame: string, scaleFactor: number = 1) => (
    <View
      style={{
        width: 112 * scaleFactor,
        height: 112 * scaleFactor,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ transform: [{ scale: scaleFactor }] }} pointerEvents="none">
        <UserAvatar avatarUrl={url || null} frame={frame} />
      </View>
    </View>
  );

  // Verificamos si el usuario ya posee el marco seleccionado
  const userOwnsFrame = userFrames.includes(selectedFrame);

  const handleActionButton = () => {
    if (userOwnsFrame) {
      handleSaveFrame(selectedFrame);
    } else {
      // Lógica para mostrar el anuncio
      if (Platform.OS === 'web') {
        // Si está en web simulamos el desbloqueo automático porque no hay anuncios AdMob
        unlockFrame(selectedFrame);
        return;
      }

      if (adLoaded && rewardedAd) {
        frameToUnlockRef.current = selectedFrame; // Guardamos el marco a desbloquear
        setIsWatchingAd(true);
        rewardedAd.show();
      } else {
        if (rewardedAd) {
          rewardedAd.load();
        }
        showNotification({
          title: 'Anuncio cargando...',
          description:
            'El anuncio aún no está listo. Por favor, espera unos segundos e inténtalo de nuevo.',
          isChoice: false,
          delete: false,
          success: false,
        });
      }
    }
  };

  return (
    <Screen>
      <ReturnButton route="back" title="Selecciona un marco" />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}>
        <View className="items-center justify-center py-10">
          <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            {renderAvatar(currentAvatarUrl, selectedFrame, 1.4)}
          </TouchableOpacity>
        </View>

        <View />

        <View className="flex-row flex-wrap justify-between">
          {availableFrames.map((frame) => {
            const isSelected = selectedFrame === frame;

            const isOwned = userFrames.includes(frame);

            return (
              <TouchableOpacity
                key={frame}
                onPress={() => setSelectedFrame(frame)}
                className="mb-4 items-center justify-center overflow-hidden rounded-2xl"
                style={{
                  width: '30%',
                  aspectRatio: 1,
                  backgroundColor: isSelected ? `${colors.primary}33` : colors.surfaceButton,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : 'transparent',
                  opacity: !isOwned && !isSelected ? 0.7 : 1,
                }}
                activeOpacity={0.7}>
                {frame === 'none' ? (
                  <View className="items-center justify-center">
                    <FontAwesome5 name="ban" size={32} color={colors.error} />
                  </View>
                ) : (
                  <View className="items-center justify-center">
                    {renderAvatar(null, frame, 0.6)}
                  </View>
                )}

                {!isOwned && (
                  <View
                    className="absolute right-2 top-2 rounded-full p-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <FontAwesome5 name="lock" size={10} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleActionButton}
          disabled={saving || loading || isWatchingAd}
          className="mt-[-20px] flex-row items-center justify-center gap-2 rounded-xl py-4 shadow-lg"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}>
          {!userOwnsFrame && !loading && (
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={24}
              color={colors.background}
            />
          )}

          <Text className="text-center text-lg font-bold" style={{ color: colors.background }}>
            {saving || isWatchingAd ? 'Cargando...' : userOwnsFrame ? 'Guardar' : 'Obtener'}
          </Text>
        </TouchableOpacity>

        <View />
      </ScrollView>
    </Screen>
  );
}

import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from 'components/Icons';
import { SongResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { RatingCard } from '@/Details/components/RatingCard';
import { DateCard } from '@/Details/components/DateCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { useAuth } from 'context/AuthContext';
import { AdBanner } from 'components/AdBanner';
import { ResourceHeader } from '@/Details/components/ResourceHeader';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function SongDetail() {
  const { item, from } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getPath = () => {
    if (from === 'profile') return '/(tabs)/Profile';
	if (from === 'home') return '/(tabs)/Home';
    if (from === 'user' || from === 'list' || from === 'group') return 'back';
    return '/(tabs)/Collection';
  };
  const path = getPath();

  let songResource: SongResource | null = null;

  try {
    songResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = songResource?.usuarioId === user?.id;

  const isPending = songResource?.estado === 'PENDIENTE';

  if (!songResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <ReturnButton route={path} title="Detalle de la canción" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 text-xl font-bold text-primaryText">
            {t('details.loadingError.title')}
          </AppText>
          <AppText className="mt-2 text-center text-secondaryText">
            {t('details.loadingError.albums')}
          </AppText>
        </View>
      </Screen>
    );
  }

  const { contenido } = songResource;

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ResourceHeader
          imageUrl={contenido.imagenUrl}
          resource={songResource}
          type="cancion"
          returnRoute={path}
          from={from}
          isOwner={isOwner}
        />
        <View className="flex-1 px-4 pb-6">
          {!isPending && (
            <View className="flex-col justify-between gap-3">
              <View className="flex-row gap-2">
                {songResource?.calificacion > 0 && (
                  <RatingCard rating={songResource.calificacion} />
                )}
                <DateCard startDate={songResource.fechaEscucha} isRange={false} />
              </View>
              <ReviewCard review={songResource.reseña} />
            </View>
          )}
        </View>
        {!isPending && (
          <View className="flex-1">
            <AdBanner />
          </View>
        )}
      </ScrollView>
      {isPending && <AdBanner />}
    </Screen>
  );
}

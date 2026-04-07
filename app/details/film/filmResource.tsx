import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FilmResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { RatingCard } from '@/Details/components/RatingCard';
import { DateCard } from '@/Details/components/DateCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { useAuth } from 'context/AuthContext';
import { AdBanner } from 'components/AdBanner';
import { ResourceHeader } from '@/Details/components/ResourceHeader';

export default function FilmDetail() {
  const { item, from } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();

  const getPath = () => {
    if (from === 'profile') return '/(tabs)/Profile';
    if (from === 'user' || from === 'list' || from === 'group') return 'back';
    return '/(tabs)/Collection';
  };
  const path = getPath();

  let filmResource: FilmResource | null = null;

  try {
    filmResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = filmResource?.usuarioId === user?.id;
  const isPending = filmResource?.estado === 'PENDIENTE';

  if (!filmResource) {
    return (
      <Screen>
        <ThemedStatusBar />
        <ReturnButton route={path} title="Detalle de la película" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información de la película
          </Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = filmResource;

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ResourceHeader
          imageUrl={contenido.imagenUrl}
          resource={filmResource}
          type="pelicula"
          returnRoute={path}
          from={from}
          isOwner={isOwner}
        />

        <View className="flex-1 px-4 pb-6">
          {!isPending && (
            <View className="flex-col justify-between gap-3">
              <View className="flex-row gap-2">
                {filmResource?.calificacion > 0 && (
                  <RatingCard rating={filmResource.calificacion} />
                )}
                <DateCard startDate={filmResource.fechaVisionado} isRange={false} />
              </View>
              <ReviewCard review={filmResource.reseña} />
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

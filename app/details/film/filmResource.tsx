import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FilmResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ResourceType } from 'hooks/useResource';
import { ResourceAttributes } from '@/Details/components/ResourceAttributes';
import { RatingCard } from '@/Details/components/RatingCard';
import { DateCard } from '@/Details/components/DateCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { EditResourceButton } from '@/Details/components/EditResourceButton';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';

export default function FilmDetail() {
  const { item } = useLocalSearchParams();
  const { colors } = useTheme();

  let filmResource: FilmResource | null = null;

  try {
    filmResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  if (!filmResource) {
    return (
      <Screen>
        <ThemedStatusBar />
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
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton
              route="/Collection"
              title={'Detalle de la película'}
              style={' '}
              params={{ initialResource: 'pelicula' as ResourceType }}
            />
          </View>
          <EditResourceButton resource={filmResource} type={'pelicula'} />
          <DeleteResourceButton resource={filmResource} type={'pelicula'} />
        </View>
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[600px] w-full rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="mb-14 px-4 pb-6">
          <ResourceAttributes resource={filmResource} />
          <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              <RatingCard rating={filmResource.calificacion} />
              <DateCard startDate={filmResource.fechaVisionado} isRange={false} />
            </View>
            <ReviewCard review={filmResource.reseña} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

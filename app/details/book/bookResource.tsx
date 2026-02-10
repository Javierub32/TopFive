import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BookResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ResourceType } from 'hooks/useResource';
import { RatingCard } from '@/Details/components/RatingCard';
import { ProgressCard } from '@/Details/components/ProgressCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { DateCard } from '@/Details/components/DateCard';
import { ResourceAttributes } from '@/Details/components/ResourceAttributes';
import { TimeCard } from '@/Details/components/TimeCard';
import { EditResourceButton } from '@/Details/components/EditResourceButton';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';

export default function BookDetail() {
  const { item } = useLocalSearchParams();
  const { colors } = useTheme();

  let bookResource: BookResource | null = null;

  try {
    bookResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  if (!bookResource) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información del libro
          </Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = bookResource;

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton
              route="/Collection"
              title={'Detalle del libro'}
              style={' '}
              params={{ initialResource: 'libro' as ResourceType }}
            />
          </View>
          <EditResourceButton resource={bookResource} type={'libro'} />
          <DeleteResourceButton resource={bookResource} type={'libro'} />
        </View>
        {/* Imagen del libro */}
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[600px] w-full rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>
        <View className="mb-14 px-4 pb-6">
          <ResourceAttributes resource={bookResource} />
          <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              <RatingCard rating={bookResource.calificacion} />
              <ProgressCard progress={bookResource.paginasLeidas} unit="pags" />
            </View>
            <ReviewCard review={bookResource.reseña} />
            <DateCard
              startDate={bookResource.fechaInicio}
              endDate={bookResource.fechaFin}
              isRange={true}
            />
          </View>
          <TimeCard resource={bookResource} />
        </View>
      </ScrollView>
    </Screen>
  );
}

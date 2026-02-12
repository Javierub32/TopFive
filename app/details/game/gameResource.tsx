import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ResourceType } from 'hooks/useResource';
import { ResourceAttributes } from '@/Details/components/ResourceAttributes';
import { RatingCard } from '@/Details/components/RatingCard';
import { ProgressCard } from '@/Details/components/ProgressCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { DateCard } from '@/Details/components/DateCard';
import { EditResourceButton } from '@/Details/components/EditResourceButton';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';
import { useAuth } from "context/AuthContext";

export default function GameDetail() {
  const { item } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();

  let gameResource: GameResource | null = null;

  try {
    gameResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = gameResource?.usuarioId === user?.id;

  if (!gameResource) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información del videojuego
          </Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = gameResource;

  return (
    <Screen>
      <ThemedStatusBar />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton
              route="/Collection"
              title={'Detalle del videojuego'}
              style={' '}
              params={{ initialResource: 'videojuego' as ResourceType }}
            />
          </View>
          {isOwner && (
            <>
            <EditResourceButton resource={gameResource} type="videojuego" />
            <DeleteResourceButton resource={gameResource} type="videojuego" />
            </>

          )}
        </View>

        {/* Imagen del videojuego */}
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[600px] w-full rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>

        <View className="mb-14 px-4 pb-6">
          <ResourceAttributes resource={gameResource} isOwner={isOwner} />
          <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              <RatingCard rating={gameResource.calificacion} />
              <ProgressCard progress={gameResource.horasJugadas} unit="horas" />
            </View>
            <ReviewCard review={gameResource.reseña} />
            <DateCard
              startDate={gameResource.fechaInicio}
              endDate={gameResource.fechaFin}
              isRange
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

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
import { AdBanner } from 'components/AdBanner';
import { ResourceHeader } from "@/Details/components/ResourceHeader";

export default function GameDetail() {
  const { item, from } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();

  const getPath = () => {
    if (from === 'profile') return '/(tabs)/Profile';
    if (from === 'user' || from === 'list' || from === 'group') return 'back';
    return '/(tabs)/Collection';
  };
  const path = getPath();

  let gameResource: GameResource | null = null;

  try {
    gameResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = gameResource?.usuarioId === user?.id;
  const isPending = gameResource?.estado === "PENDIENTE"
  const isCompleted = gameResource?.estado === "COMPLETADO"

  if (!gameResource) {
    return (
      <Screen>
        <ThemedStatusBar />
		<ReturnButton route={path} title="Detalle del videojuego" />
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
        <ResourceHeader imageUrl={contenido.imagenUrl || 'https://via.placeholder.com/500x750'} type="videojuego" resource={gameResource} returnRoute={path} from={from} isOwner={isOwner}/>

        <View className="flex-1 px-4 pb-6">
          {!isPending && (
            <View className="flex-col justify-between gap-3">
            <View className="flex-row gap-2">
              {gameResource?.calificacion > 0 && (
                <RatingCard rating={gameResource.calificacion} />
              )}
              {!isCompleted && (
                <ProgressCard progress={gameResource.horasJugadas} unit="horas" />
              )}              
            </View>
            <ReviewCard review={gameResource.reseña} />
            <DateCard
              startDate={gameResource.fechaInicio}
              endDate={gameResource.fechaFin}
              isRange
            />
          </View>
          )}          
        </View>
        <View className="flex-1">
          <AdBanner/>
        </View>
      </ScrollView>
    </Screen>
  );
}

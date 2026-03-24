import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SongResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { ResourceType } from 'hooks/useResource';
import { EditResourceButton } from '@/Details/components/EditResourceButton';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ResourceAttributes } from '@/Details/components/ResourceAttributes';
import { RatingCard } from '@/Details/components/RatingCard';
import { DateCard } from '@/Details/components/DateCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { useAuth } from "context/AuthContext";
import { AdBanner } from 'components/AdBanner';

export default function SongDetail() {
  const { item, from } = useLocalSearchParams();
  const { user } = useAuth();

  const getPath = () => {
	if (from === 'profile') return '/(tabs)/Profile';
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

  const isPending = songResource?.estado === "PENDIENTE";

  if (!songResource) {
    return (
      <Screen>
        <StatusBar style="light" />
		<ReturnButton route={path} title="Detalle de la canción" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la canción
          </Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = songResource;

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton
              route={path}
              title={'Detalle de la canción'}
              style={' '}
              params={{ initialResource: 'cancion' as ResourceType }}
            />
          </View>
          {isOwner && (
            <>
            <EditResourceButton resource={songResource} type="cancion" from={from}/>
            <DeleteResourceButton resource={songResource} type="cancion" />
            </>

          )}

        </View>
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[600px] w-full rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>
        <View className="mb-14 px-4 pb-6">
          <ResourceAttributes resource={songResource} isOwner={isOwner} />
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
		<AdBanner/>
      </ScrollView>
    </Screen>
  );
}

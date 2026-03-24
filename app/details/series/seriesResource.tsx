import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SeriesResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { ThemeContext, useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { AddToListButton } from 'components/AddToListButton';
import { ResourceType, useResource } from 'hooks/useResource';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { EditResourceButton } from '@/Details/components/EditResourceButton';
import { DeleteResourceButton } from '@/Details/components/DeleteResourceButton';
import { ResourceAttributes } from '@/Details/components/ResourceAttributes';
import { RatingCard } from '@/Details/components/RatingCard';
import { ProgressCard } from '@/Details/components/ProgressCard';
import { DateCard } from '@/Details/components/DateCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { useAuth } from "context/AuthContext";
import { AdBanner } from 'components/AdBanner';

export default function SeriesDetail() {
  const { item, from } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();

  const getPath = () => {
    if (from === 'profile') return '/(tabs)/Profile';
    if (from === 'user' || from === 'list' || from === 'group') return 'back';
    return '/(tabs)/Collection';
  };
  const path = getPath();

  let seriesResource: SeriesResource | null = null;

  try {
    seriesResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = seriesResource?.usuarioId === user?.id;
  
  const isPending = seriesResource?.estado === "PENDIENTE"
  const isCompleted = seriesResource?.estado === "COMPLETADO"



  if (!seriesResource) {
    return (
      <Screen>
        <StatusBar style="light" />
		<ReturnButton route={path} title="Detalle de la serie" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la serie
          </Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = seriesResource;

  const getProgress = () => {
    return seriesResource.temporadaActual + '-' + seriesResource.episodioActual;
  };

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton
              route={path}
              title={'Detalle de la serie'}
              style={' '}
              params={{ initialResource: 'serie' as ResourceType }}
            />
          </View>
          {isOwner && (
            <>
            <EditResourceButton resource={seriesResource} type="serie" from={from} />
            <DeleteResourceButton resource={seriesResource} type="serie" />
            </>
          )}
          
        </View>
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[500px] w-full rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>
        <View className="mb-14 px-4 pb-6">
          <ResourceAttributes resource={seriesResource} isOwner={isOwner} />
          {!isPending && (
            <View className="flex-col justify-between gap-3">
              <View className="flex-row gap-2">
                {seriesResource?.calificacion > 0 && (
                  <RatingCard rating={seriesResource.calificacion} />
                )}
                {!isCompleted && (
                  <ProgressCard progress={getProgress()} />
                )}
              </View>
              <ReviewCard review={seriesResource.reseña} />
              <DateCard
                startDate={seriesResource.fechaInicio}
                endDate={seriesResource.fechaFin}
                isRange
              />
            </View>
          )}
          
        </View>
		<AdBanner/>
      </ScrollView>
    </Screen>
  );
}

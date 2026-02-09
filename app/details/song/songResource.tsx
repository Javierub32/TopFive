import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SongResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { AddToListButton } from 'components/AddToListButton';
import { ResourceType, useResource } from 'hooks/useResource';
import { EditResourceButton } from "@/Details/components/EditResourceButton";
import { DeleteIcon } from "components/Icons";
import { DeleteResourceButton } from "@/Details/components/DeleteResourceButton";
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { Atributes } from "@/Details/components/Atributes";
import { RatingCard } from "@/Details/components/RatingCard";
import { DateCard } from "@/Details/components/DateCard";
import { ReviewCard } from "@/Details/components/ReviewCard";

export default function SongDetail() {
  const { item } = useLocalSearchParams();
    
  let songResource: SongResource | null = null;
  
  try {
    songResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }  

  if (!songResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryText text-center mt-2">No se pudo cargar la información de la canción</Text>
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
              route="/Collection"
              title={'Detalle de la canción'}
              style={' '}
              params={{ initialResource: 'cancion' as ResourceType }}
            />
          </View>
          <EditResourceButton resource={songResource} type="cancion" />
          <DeleteResourceButton resource={songResource} type="cancion" />
        </View>
        <View className="mb-4 px-4">
          <Image
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="h-[600px] w-full rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>
        <View className="px-4 pb-6">
          <Atributes resource={songResource} />
          <View className="mb-6 gap-4">
            <View className="flex-row gap-2">
              <RatingCard rating={songResource.calificacion} />
              <DateCard startDate={songResource.fechaEscucha} isRange={false} />
            </View>
            <ReviewCard review={songResource.reseña} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

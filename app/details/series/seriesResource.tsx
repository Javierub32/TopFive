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
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { EditResourceButton } from "@/Details/components/EditResourceButton";
import { DeleteResourceButton } from "@/Details/components/DeleteResourceButton";
import { Atributes } from "@/Details/components/Atributes";
import { RatingCard } from "@/Details/components/RatingCard";
import { ProgressCard } from "@/Details/components/ProgressCard";
import { DateCard } from "@/Details/components/DateCard";
import { ReviewCard } from "@/Details/components/ReviewCard";

export default function SeriesDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();
  const { refreshData } = useCollection();
  const { colors } = useTheme();    

  
  let seriesResource: SeriesResource | null = null;
    
    try {
      seriesResource = item ? JSON.parse(item as string) : null;
    } catch (error) {
      console.error('Error parsing item:', error);
    }
  

  const handleDelete = () => {
	if (seriesResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar esta serie de tu colección?', [
			{ text: 'Confirmar', onPress: async () => {
				await borrarRecurso(seriesResource.id, 'serie');
				refreshData();
				router.replace({ pathname: '/Collection', params: { initialResource: 'serie' as ResourceType } })
			} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };

  const handleEdit = () => {
    if (seriesResource) {
      router.push({
        pathname: '/form/series',
        params: { item: JSON.stringify(seriesResource) }
      });
    }
  };

  if (!seriesResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryText text-center mt-2">No se pudo cargar la información de la serie</Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = seriesResource;

  const getProgress = () => {
    return seriesResource.temporadaActual + '-' + seriesResource.episodioActual;
  }

  return (
    <Screen>
      <ThemedStatusBar/>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1"> 
            <ReturnButton route="/Collection" title={'Detalle de la serie'} style={" "} params={{initialResource: 'serie' as ResourceType}}/>
          </View>
          <EditResourceButton resource={seriesResource} type='serie'/>
          <DeleteResourceButton resource={seriesResource} type='serie'/>
        </View>
        <View className="px-4 mb-4">
          <Image source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }} className="w-full h-[500px] rounded-2xl bg-background" resizeMode="cover" />
        </View>
        <View className="px-4 pb-6">
          <Atributes resource={seriesResource}/>
          <View className="gap-4 mb-6">
            <View className="flex-row gap-2">
              <RatingCard rating={seriesResource.calificacion}/>
              <ProgressCard progress={getProgress()}/>
            </View>  
            <ReviewCard review={seriesResource.reseña}/>          
            <DateCard startDate={seriesResource.fechaInicio} endDate={seriesResource.fechaFin} isRange/>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

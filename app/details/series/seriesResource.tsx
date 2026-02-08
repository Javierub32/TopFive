import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SeriesResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { AddToListButton } from 'components/AddToListButton';
import { ResourceType, useResource } from 'hooks/useResource';

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
  const releaseYear = contenido.fechaLanzamiento ? new Date(contenido.fechaLanzamiento).getFullYear() : 'N/A';
  const endedYear = contenido.fechaFin ? new Date(contenido.fechaFin).getFullYear() : null;
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'Viendo';
      case 'COMPLETADO': return 'Completado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-borderButton';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      default: return 'bg-borderButton';
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle de la serie'} style={" "} params={{initialResource: 'serie' as ResourceType}}/>
          </View>
          <TouchableOpacity 
            onPress={handleEdit}
            className="h-10 w-10 items-center justify-center rounded-full bg-blue-600 border border-blue-500 mr-2"
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="h-10 w-10 items-center justify-center rounded-full bg-red-600 border border-red-500 mr-2" activeOpacity={0.7}>
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="px-4 mb-4">
          <Image source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }} className="w-full h-[500px] rounded-2xl bg-background" resizeMode="cover" />
        </View>
        <View className="px-4 pb-6">
          <View className="mb-4">
			<View className="flex-row items-center justify-between">
				<Text className="text-3xl font-bold mb-2" style={{ color: colors.primaryText }}>
				{contenido.titulo || 'Sin título'}
				</Text>
				<AddToListButton resourceCategory="Series" resourceId={seriesResource.id} />
			</View>
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg border border-borderButton">
                <Text className="text-secondaryText text-sm font-semibold">{endedYear ? `${releaseYear} - ${endedYear}` : `${releaseYear} - Presente`}</Text>
              </View>
              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(seriesResource.estado)}`}>
                <Text className="text-primaryText text-xs font-bold uppercase">{getStatusText(seriesResource.estado)}</Text>
              </View>
              {seriesResource.favorito && (
                <View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center">
                  <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                  <Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text>
                </View>
              )}
              {seriesResource.numVisualizaciones > 0 && (
                <View className="bg-marker px-3 py-1.5 rounded-lg border border-primary/30 flex-row items-center">
                  <MaterialCommunityIcons name="eye" size={16} color="#a855f7" />
                  <Text className="text-markerText text-xs font-bold ml-1">{seriesResource.numVisualizaciones}x</Text>
                </View>
              )}
            </View>
          </View>
          <View className="gap-4 mb-6">
            {seriesResource.calificacion > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Tu calificación</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (<FontAwesome5 key={star} name="star" size={20} color={star <= seriesResource.calificacion ? '#fbbf24' : '#475569'} solid={star <= seriesResource.calificacion} style={{ marginRight: 4 }} />))}
                  <Text className="text-primaryText text-lg font-bold ml-2">{seriesResource.calificacion}/5</Text>
                </View>
              </View>
            )}
            {contenido.calificacion && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Calificación general</Text>
                <View className="flex-row items-center"><MaterialCommunityIcons name="star" size={24} color="#fbbf24" /><Text className="text-primaryText text-lg font-bold ml-2">{contenido.calificacion.toFixed(1)}/10</Text></View>
              </View>
            )}
            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
              <Text className="text-title text-sm font-bold mb-2 uppercase">Progreso</Text>
              <View className="flex-row items-center"><MaterialCommunityIcons name="television-play" size={24} color={colors.primary} /><Text className="text-primaryText text-lg font-bold ml-2">T{seriesResource.temporadaActual} - E{seriesResource.episodioActual}</Text></View>
            </View>
            {(seriesResource.fechaInicio || seriesResource.fechaFin) && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-3 uppercase">Periodo de visualización</Text>
                <View className="gap-2">
                  {seriesResource.fechaInicio && (<View className="flex-row items-center"><MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} /><Text className="text-secondaryText text-sm ml-2 mr-2">Inicio:</Text><Text className="text-primaryText text-sm font-semibold">{new Date(seriesResource.fechaInicio).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>)}
                  {seriesResource.fechaFin && (<View className="flex-row items-center"><MaterialCommunityIcons name="calendar-end" size={20} color={colors.primary} /><Text className="text-secondaryText text-sm ml-2 mr-2">Fin:</Text><Text className="text-primaryText text-sm font-semibold">{new Date(seriesResource.fechaFin).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>)}
                </View>
              </View>
            )}
            {contenido.genero && contenido.genero.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Géneros</Text>
                <View className="flex-row flex-wrap gap-2">{contenido.genero.map((genre, index) => (<View key={index} className="bg-marker px-3 py-1.5 rounded-lg border border-primary/30"><Text className="text-primary text-sm">{genre}</Text></View>))}</View>
              </View>
            )}
            {contenido.descripcion && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Descripción</Text><Text className="text-secondaryText text-base leading-6">{contenido.descripcion}</Text></View>)}
            {seriesResource.reseña && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Tu reseña</Text><Text className="text-secondaryText text-base leading-6">{seriesResource.reseña}</Text></View>)}
            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Agregado a tu colección</Text><View className="flex-row items-center"><MaterialCommunityIcons name="calendar-plus" size={20} color={colors.primary} /><Text className="text-primaryText text-sm ml-2">{new Date(seriesResource.fechacreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View></View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

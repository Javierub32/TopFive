import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { FilmResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useResource } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { AddToListButton } from 'components/AddToListButton';
import { ThemedStatusBar } from 'components/ThemedStatusBar';


export default function FilmDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();
  const { refreshData } = useCollection();
  const {colors} = useTheme();
  
  let filmResource: FilmResource | null = null;
    
    try {
      filmResource = item ? JSON.parse(item as string) : null;
    } catch (error) {
      console.error('Error parsing item:', error);
    }
  
  const handleDelete = () => {
	if (filmResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar esta película de tu colección?', [
			{ text: 'Confirmar', onPress: async () => {
				await borrarRecurso(filmResource.id, 'pelicula');
				refreshData();
				router.replace({ pathname: '/Collection', params: { initialResource: 'Películas' } })
			} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };
    const handleEdit = () => {
  if (filmResource) {
    router.push({
      pathname: '/form/film',
      params: { item: JSON.stringify(filmResource) }
    });
  }
};

  if (!filmResource) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color:colors.secondaryText}}>No se pudo cargar la información de la película</Text>
        </View>
      </Screen>
    );
  }

  const { contenidopelicula } = filmResource;
  const releaseYear = contenidopelicula.fechaLanzamiento ? new Date(contenidopelicula.fechaLanzamiento).getFullYear() : 'N/A';
  
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
      case 'PENDIENTE': return colors.warning;
      case 'EN_CURSO': return colors.accent;
      case 'COMPLETADO': return colors.success;
      default: return colors.surfaceButton;
    }
  };

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle de la película'} style={" "} params={{initialResource: 'Películas'}}/>
          </View>
          {/* Botón de editar */}
          <TouchableOpacity 
            onPress={handleEdit}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style ={{backgroundColor: `${colors.primary}99`, borderColor: colors.primary}}
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color={colors.primaryText} />
          </TouchableOpacity>
          
          {/* Botón de eliminar */}
          <TouchableOpacity 
            onPress={handleDelete}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style={{backgroundColor: `${colors.error}99`, borderColor: colors.error}}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete" size={24} color={colors.primaryText}/>
          </TouchableOpacity>
        </View>

        {/* Imagen de la película */}
        <View className="px-4 mb-4">
          <Image 
            source={{ uri: contenidopelicula.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[600px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          {/* Título y añadir a lista */}
          <View className="mb-4">
            <View className="flex-1 flex-row justify-between mb-2 items-center">
              <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              {contenidopelicula.titulo || 'Sin título'}
              </Text>
              <AddToListButton resourceCategory="Películas" resourceId={filmResource.id} />
            </View>
            
            <View className="flex-row items-stretch flex-wrap gap-2">
              {/* Año de estreno */}
              <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-semibold" style={{color: colors.secondaryText}}>
                  {releaseYear}
                </Text>
              </View>

              {/* Estado */}
              <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor:`${getStatusColor(filmResource.estado)}33`}}>
                <Text className="text-sm font-semibold uppercase" style={{color: getStatusColor(filmResource.estado)}}>
                  {getStatusText(filmResource.estado)}
                </Text>
              </View>

              {/* Favorito */}
              {filmResource.favorito && (
                <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor: `${colors.favorite}33`}}>
                  <MaterialCommunityIcons name="heart" size={16} color={colors.favorite} />
                </View>
              )}

              {/* Número de visionados */}
              {filmResource.numVisionados > 0 && (
                <View className="px-3 py-1.5 rounded-lg flex-row items-center" style={{backgroundColor: `${colors.accent}33`}}>
                  <MaterialCommunityIcons name="eye" size={16} color={colors.accent} />
                  <Text className="text-xs font-bold ml-1" style={{color:colors.markerText}}>
                    {filmResource.numVisionados}x
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className='flex-1 flex-col justify-between gap-3'>
            <View className='flex-row gap-2'>
              <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.rating}1A`}}>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='star-circle' size={20} color={colors.rating}/>
                  <Text className='text-sm font-bold uppercase tracling-widest' style={{color: colors.markerText}}>Calificación</Text>
                </View>
                <View className='flex-row'>
                  {[1,2,3,4,5].map((star)=>(
                    <FontAwesome5
                      key={star}
                      name="star"
                      size={20}
                      color={star <= filmResource.calificacion ? colors.rating : colors.markerText}
                      solid={star <= filmResource.calificacion}
                      style={{ marginRight: 4 }}
                    />
                  ))}
                </View>
              </View>

              <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.primary}1A`}}>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='calendar' size={20} color={colors.primary} />
                  <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Última vez</Text>
                </View>
                <View className='flex-row items-baseline'>
                  <Text className='text-xl font-bold' style={{ color: colors.primaryText}}>
                    {filmResource.fechaVisionado ? new Date(filmResource.fechaVisionado).toLocaleDateString() : '-'}
                  </Text>
                </View>
              </View>
            </View>

            <View className='flex-1 p-5 rounded-2xl gap-3 border-l-4' style={{backgroundColor:colors.surfaceButton, borderColor:colors.borderButton}}>
              <View className='flex-row items-center gap-2'>
                <MaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary}/>
                <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Reseña</Text>
              </View>
              <Text className='leading-relaxed italic' style={{color: colors.primaryText}}>
                {filmResource.reseña || '-'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

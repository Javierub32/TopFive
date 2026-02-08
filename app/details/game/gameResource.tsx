import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { GameResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { AddToListButton } from 'components/AddToListButton';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ResourceType, useResource } from 'hooks/useResource';


export default function GameDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();
  const { refreshData } = useCollection();
  const { colors } = useTheme();

  let gameResource: GameResource | null = null;
    
    try {
      gameResource = item ? JSON.parse(item as string) : null;
    } catch (error) {
      console.error('Error parsing item:', error);
    }
  

  const handleDelete = () => {
	if (gameResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este videojuego de tu colección?', [
			{ text: 'Confirmar', onPress: async () => {
				await borrarRecurso(gameResource.id, 'videojuego');
				refreshData();
				router.replace({ pathname: '/Collection', params: { initialResource: 'videojuego' as ResourceType } })
			} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };

  const handleEdit = () => {
    if (gameResource) {
      router.push({
        pathname: '/form/game',
        params: { item: JSON.stringify(gameResource) }
      });
    }
  };

  if (!gameResource) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color:colors.secondaryText}}>No se pudo cargar la información del videojuego</Text>
        </View>
      </Screen>
    );
  }

  const { contenido } = gameResource;
  const releaseYear = contenido.fechaLanzamiento ? new Date(contenido.fechaLanzamiento).getFullYear() : 'N/A';
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'Jugando';
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
  
  const getDificultyColor = (dificultad: string) => {
    switch(dificultad){
      case 'Fácil': return colors.success;
      case 'Normal': return colors.surfaceButton;
      case 'Difícil': return colors.warning;
      case 'Extremo': return colors.error;
    }
  }

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle del videojuego'} style={" "} params={{initialResource: 'videojuego' as ResourceType}}/>
          </View>
          {/* Botón de editar */}
          <TouchableOpacity 
            onPress={handleEdit}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style={{backgroundColor: `${colors.primary}99`, borderColor: colors.primary}}
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color={colors.primaryText} />
          </TouchableOpacity>
          {/* Botón de eliminar */}
          <TouchableOpacity 
            onPress={handleDelete}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style={{backgroundColor: `${colors.error}99`, borderColor:colors.error}}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete" size={24} color={colors.primaryText}/>
          </TouchableOpacity>
        </View>

        {/* Imagen del videojuego */}
        <View className="px-4 mb-4">
          <Image 
            source={{ uri: contenido.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[600px] rounded-2xl"
            style={{backgroundColor: colors.surfaceButton}}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          <View className="mb-4">
            {/* Título y añadir a lista */}
            <View className="flex-1 flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              {contenido.titulo || 'Sin título'}
              </Text>
              <AddToListButton resourceCategory="Videojuegos" resourceId={gameResource.id} />
            </View>
            
            {/* Atributos */}
            <View className="flex-row items-stretch flex-wrap gap-2">
              {/* Año */}
              <View className="px-3 py-1.5 rounded-lg" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-semibold" style={{color:colors.secondaryText}}>
                  {releaseYear}
                </Text>
              </View>

              {/* Estado */}
              <View className="px-3 py-1.5 rounded-lg" style={{backgroundColor: `${getStatusColor(gameResource.estado)}33`}}>
                <Text className="text-xs font-bold uppercase" style={{color: getStatusColor(gameResource.estado)}}>
                  {getStatusText(gameResource.estado)}
                </Text>
              </View>

              {/* Dificultad */}
              {gameResource.dificultad && (
                <View className='flex-row px-3 py-1.5 rounded-lg justify-between items-center' style={{backgroundColor: `${getDificultyColor(gameResource.dificultad)}33`}}>
                  <MaterialCommunityIcons name="speedometer" color={getDificultyColor(gameResource.dificultad)}/>
                  <Text className="text-semibold text-xs ml-1" style={{color: getDificultyColor(gameResource.dificultad)}}>{gameResource.dificultad}</Text>
                </View>
              )}

              {/* Favorito */}
              {gameResource.favorito && (
                <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor: `${colors.favorite}33`}}>
                  <MaterialCommunityIcons name="heart" size={16} color={colors.favorite} />
                </View>
              )}
            </View>
          </View>


          {/* TARJETAS */}  
          <View className='flex-col justify-between gap-3'>
            <View className='flex-row gap-2'>
              {/* Calificación  */}
              <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.rating}1A`}}>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name="star-circle" size={20} color={colors.rating} />
                  <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Calificación</Text>
                </View>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome5
                      key={star}
                      name="star"
                      size={20}
                      color={star <= gameResource.calificacion ? colors.rating : colors.markerText}
                      solid={star <= gameResource.calificacion}
                      style={{ marginRight: 4 }}
                    />
                  ))}
                </View>
              </View>

              {/* Progreso */}
              <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.primary}1A`}}>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name="clock" size={20} color={colors.primary}/>
                  <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Progreso</Text>
                </View>
                <View className='flex-row items-baseline'>
                  <Text className='text-xl font-bold' style={{color: colors.primaryText}}>
                    {gameResource.horasJugadas || 0}
                  </Text>
                  <Text className='text-xs ml-1' style={{color: colors.markerText}}>horas</Text>
                </View>
              </View>
            </View>

            {/* Reseña */}
            <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2 border-l-4' style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
              <View className='flex-row items-center gap-2'>
                <MaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary}/>
                <Text className='text-sm font-bold uppercase tracking-widest' style={{ color: colors.markerText}}>Reseña</Text>
              </View>
              <Text className='leading-relaxed italic' style={{color: colors.primaryText}}>
                {gameResource.reseña || '-'}
              </Text>
            </View>

            {/* Fechas */}
            <View className='flex-row gap-2'>
              {/* Fecha Inicio */}
              <View className='flex-1 p-4 rounded-2xl gap-2' style={{backgroundColor : colors.surfaceButton}}>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>Inicio</Text>
                </View>
                <View>
                  <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                  {gameResource.fechaInicio ? new Date(gameResource.fechaInicio).toLocaleDateString() : '-'}
                  </Text>
                </View>
              </View>

              {/* Fecha fin */}
              <View className="flex-1 p-4 rounded-2xl space-y-2" style={{ backgroundColor: colors.surfaceButton }}>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="calendar-end" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondaryText }}>Fin</Text>
                </View>
                <View>
                  <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                  {gameResource.fechaFin ? new Date(gameResource.fechaFin).toLocaleDateString() : '-'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

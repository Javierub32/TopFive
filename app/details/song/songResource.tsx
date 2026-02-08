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

export default function SongDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();
  const { refreshData } = useCollection();
  const {colors} = useTheme();
  
  let songResource: SongResource | null = null;
  
  try {
    songResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const handleDelete = () => {
	if (songResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar esta canción de tu colección?', [
			{ text: 'Confirmar', onPress: async () => {
				await borrarRecurso(songResource.id, 'cancion');
				refreshData();
				router.replace({ pathname: '/Collection', params: { initialResource: 'cancion' as ResourceType } })
			} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };

  const handleEdit = () => {
    if (songResource) {
      router.push({
        pathname: '/form/song',
        params: { item: JSON.stringify(songResource) }
      });
    }
  };

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
  const releaseYear = contenido.fechaLanzamiento ? new Date(contenido.fechaLanzamiento).getFullYear() : 'N/A';
  
  const getStatusText = (status: string) => {
    return status === 'PENDIENTE' ? 'Pendiente' : 'Escuchado';
  };

  const getStatusColor = (status: string) => {
    return status === 'PENDIENTE' ? 'bg-borderButton' : 'bg-green-600';
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle de la canción'} style={" "} params={{initialResource: 'cancion' as ResourceType}}/>
          </View>
          {/* Botón de editar */}
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
				<AddToListButton resourceCategory="Canciones" resourceId={songResource.id} />
			</View>
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg border border-borderButton"><Text className="text-secondaryText text-sm font-semibold">{releaseYear}</Text></View>
              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(songResource.estado)}`}><Text className="text-primaryText text-xs font-bold uppercase">{getStatusText(songResource.estado)}</Text></View>
              {songResource.favorito && (<View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center"><MaterialCommunityIcons name="heart" size={16} color="#ef4444" /><Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text></View>)}
            </View>
          </View>
          <View className="gap-4 mb-6">
            {songResource.calificacion > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Tu calificación</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (<FontAwesome5 key={star} name="star" size={20} color={star <= songResource.calificacion ? '#fbbf24' : '#475569'} solid={star <= songResource.calificacion} style={{ marginRight: 4 }} />))}
                  <Text className="text-primaryText text-lg font-bold ml-2">{songResource.calificacion}/5</Text>
                </View>
              </View>
            )}
            {songResource.fechaEscucha && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Fecha de escucha</Text>
                <View className="flex-row items-center"><MaterialCommunityIcons name="calendar-check" size={20} color={colors.primary} /><Text className="text-primaryText text-sm ml-2">{new Date(songResource.fechaEscucha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>
              </View>
            )}
            {contenido.autor && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Artista</Text><View className="flex-row items-center"><MaterialCommunityIcons name="account-music" size={24} color={colors.primary} /><Text className="text-primaryText text-base ml-2">{contenido.autor}</Text></View></View>)}
            {contenido.albumTitulo && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Álbum</Text><View className="flex-row items-center"><MaterialCommunityIcons name="album" size={24} color={colors.primary} /><Text className="text-primaryText text-base ml-2">{contenido.albumTitulo}</Text></View></View>)}
            {contenido.genero && contenido.genero.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">Géneros</Text>
                <View className="flex-row flex-wrap gap-2">{contenido.genero.map((genre, index) => (<View key={index} className="bg-marker px-3 py-1.5 rounded-lg border border-primary/30"><Text className="text-primary text-sm">{genre}</Text></View>))}</View>
              </View>
            )}
            {songResource.reseña && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Tu reseña</Text><Text className="text-secondaryText text-base leading-6">{songResource.reseña}</Text></View>)}
            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-title text-sm font-bold mb-2 uppercase">Agregado a tu colección</Text><View className="flex-row items-center"><MaterialCommunityIcons name="calendar-plus" size={20} color={colors.primary} /><Text className="text-primaryText text-sm ml-2">{new Date(songResource.fechacreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View></View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

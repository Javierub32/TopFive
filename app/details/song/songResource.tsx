import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResource } from 'context/ResourceContext';
import { SongResource } from 'app/types/Resources';


export default function SongDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();

  const router = useRouter();
  
  let songResource: SongResource | null = null;
  
  try {
    songResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const handleDelete = () => {
	if (songResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar esta canción de tu colección?', [
			{ text: 'Confirmar', onPress: () => {borrarRecurso(songResource.id, 'cancion'); router.push('/collection')} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
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

  const { contenidocancion } = songResource;
  const releaseYear = contenidocancion.fechaLanzamiento ? new Date(contenidocancion.fechaLanzamiento).getFullYear() : 'N/A';
  
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
            <TouchableOpacity onPress={() => router.back()} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surfaceButton border border-borderButton" activeOpacity={0.7}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-primaryText text-xl font-bold flex-1" numberOfLines={1}>Detalle de la canción</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} className="h-10 w-10 items-center justify-center rounded-full bg-red-600 border border-red-500" activeOpacity={0.7}>
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="px-4 mb-4">
          <Image source={{ uri: contenidocancion.imagenUrl || 'https://via.placeholder.com/500x750' }} className="w-full h-[500px] rounded-2xl bg-background" resizeMode="cover" />
        </View>
        <View className="px-4 pb-6">
          <View className="mb-4">
            <Text className="text-primaryText text-3xl font-bold mb-2">{contenidocancion.titulo || 'Sin título'}</Text>
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg border border-borderButton"><Text className="text-secondaryText text-sm font-semibold">{releaseYear}</Text></View>
              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(songResource.estado)}`}><Text className="text-primaryText text-xs font-bold uppercase">{getStatusText(songResource.estado)}</Text></View>
              {songResource.favorito && (<View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center"><MaterialCommunityIcons name="heart" size={16} color="#ef4444" /><Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text></View>)}
            </View>
          </View>
          <View className="gap-4 mb-6">
            {songResource.calificacion > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Tu calificación</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (<FontAwesome5 key={star} name="star" size={20} color={star <= songResource.calificacion ? '#fbbf24' : '#475569'} solid={star <= songResource.calificacion} style={{ marginRight: 4 }} />))}
                  <Text className="text-primaryText text-lg font-bold ml-2">{songResource.calificacion}/5</Text>
                </View>
              </View>
            )}
            {songResource.fechaEscucha && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Fecha de escucha</Text>
                <View className="flex-row items-center"><MaterialCommunityIcons name="calendar-check" size={20} color="#8b5cf6" /><Text className="text-primaryText text-sm ml-2">{new Date(songResource.fechaEscucha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>
              </View>
            )}
            {contenidocancion.autor && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-primary text-sm font-bold mb-2 uppercase">Artista</Text><View className="flex-row items-center"><MaterialCommunityIcons name="account-music" size={24} color="#8b5cf6" /><Text className="text-primaryText text-base ml-2">{contenidocancion.autor}</Text></View></View>)}
            {contenidocancion.albumTitulo && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-primary text-sm font-bold mb-2 uppercase">Álbum</Text><View className="flex-row items-center"><MaterialCommunityIcons name="album" size={24} color="#8b5cf6" /><Text className="text-primaryText text-base ml-2">{contenidocancion.albumTitulo}</Text></View></View>)}
            {contenidocancion.genero && contenidocancion.genero.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Géneros</Text>
                <View className="flex-row flex-wrap gap-2">{contenidocancion.genero.map((genre, index) => (<View key={index} className="bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30"><Text className="text-primary text-sm">{genre}</Text></View>))}</View>
              </View>
            )}
            {songResource.reseña && (<View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-primary text-sm font-bold mb-2 uppercase">Tu reseña</Text><Text className="text-secondaryText text-base leading-6">{songResource.reseña}</Text></View>)}
            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton"><Text className="text-primary text-sm font-bold mb-2 uppercase">Agregado a tu colección</Text><View className="flex-row items-center"><MaterialCommunityIcons name="calendar-plus" size={20} color="#8b5cf6" /><Text className="text-primaryText text-sm ml-2">{new Date(songResource.fechacreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View></View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

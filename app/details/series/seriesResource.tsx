import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResource } from 'context/ResourceContext';
import { SeriesResource } from 'app/types/Resources';



export default function SeriesDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();

  const router = useRouter();
  
  let seriesResource: SeriesResource | null = null;
  
  try {
    seriesResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const handleDelete = () => {
	if (seriesResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar esta serie de tu colección?', [
			{ text: 'Confirmar', onPress: () => {borrarRecurso(seriesResource.id, 'serie'); router.push('/collection')} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };

  if (!seriesResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-white text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-gray-400 text-center mt-2">No se pudo cargar la información de la serie</Text>
        </View>
      </Screen>
    );
  }

  const { contenidoserie } = seriesResource;
  const releaseYear = contenidoserie.fechaLanzamiento ? new Date(contenidoserie.fechaLanzamiento).getFullYear() : 'N/A';
  const endedYear = contenidoserie.fechaFin ? new Date(contenidoserie.fechaFin).getFullYear() : null;
  
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
      case 'PENDIENTE': return 'bg-gray-600';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      default: return 'bg-slate-700';
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700" activeOpacity={0.7}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold flex-1" numberOfLines={1}>Detalle de la serie</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} className="h-10 w-10 items-center justify-center rounded-full bg-red-600 border border-red-500" activeOpacity={0.7}>
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View className="px-4 mb-4">
          <Image source={{ uri: contenidoserie.imagenUrl || 'https://via.placeholder.com/500x750' }} className="w-full h-[500px] rounded-2xl bg-slate-900" resizeMode="cover" />
        </View>
        <View className="px-4 pb-6">
          <View className="mb-4">
            <Text className="text-white text-3xl font-bold mb-2">{contenidoserie.titulo || 'Sin título'}</Text>
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Text className="text-gray-300 text-sm font-semibold">{endedYear ? `${releaseYear} - ${endedYear}` : `${releaseYear} - Presente`}</Text>
              </View>
              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(seriesResource.estado)}`}>
                <Text className="text-white text-xs font-bold uppercase">{getStatusText(seriesResource.estado)}</Text>
              </View>
              {seriesResource.favorito && (
                <View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center">
                  <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                  <Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text>
                </View>
              )}
              {seriesResource.numVisualizaciones > 0 && (
                <View className="bg-purple-900/40 px-3 py-1.5 rounded-lg border border-purple-500/30 flex-row items-center">
                  <MaterialCommunityIcons name="eye" size={16} color="#a855f7" />
                  <Text className="text-purple-300 text-xs font-bold ml-1">{seriesResource.numVisualizaciones}x</Text>
                </View>
              )}
            </View>
          </View>
          <View className="gap-4 mb-6">
            {seriesResource.calificacion > 0 && (
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Tu calificación</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (<FontAwesome5 key={star} name="star" size={20} color={star <= seriesResource.calificacion ? '#fbbf24' : '#475569'} solid={star <= seriesResource.calificacion} style={{ marginRight: 4 }} />))}
                  <Text className="text-white text-lg font-bold ml-2">{seriesResource.calificacion}/5</Text>
                </View>
              </View>
            )}
            {contenidoserie.calificacion && (
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Calificación general</Text>
                <View className="flex-row items-center"><MaterialCommunityIcons name="star" size={24} color="#fbbf24" /><Text className="text-white text-lg font-bold ml-2">{contenidoserie.calificacion.toFixed(1)}/10</Text></View>
              </View>
            )}
            <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Progreso</Text>
              <View className="flex-row items-center"><MaterialCommunityIcons name="television-play" size={24} color="#8b5cf6" /><Text className="text-white text-lg font-bold ml-2">T{seriesResource.temporadaActual} - E{seriesResource.episodioActual}</Text></View>
            </View>
            {(seriesResource.fechaInicio || seriesResource.fechaFin) && (
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-purple-400 text-sm font-bold mb-3 uppercase">Periodo de visualización</Text>
                <View className="gap-2">
                  {seriesResource.fechaInicio && (<View className="flex-row items-center"><MaterialCommunityIcons name="calendar-start" size={20} color="#8b5cf6" /><Text className="text-gray-400 text-sm ml-2 mr-2">Inicio:</Text><Text className="text-white text-sm font-semibold">{new Date(seriesResource.fechaInicio).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>)}
                  {seriesResource.fechaFin && (<View className="flex-row items-center"><MaterialCommunityIcons name="calendar-end" size={20} color="#8b5cf6" /><Text className="text-gray-400 text-sm ml-2 mr-2">Fin:</Text><Text className="text-white text-sm font-semibold">{new Date(seriesResource.fechaFin).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View>)}
                </View>
              </View>
            )}
            {contenidoserie.genero && contenidoserie.genero.length > 0 && (
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Géneros</Text>
                <View className="flex-row flex-wrap gap-2">{contenidoserie.genero.map((genre, index) => (<View key={index} className="bg-purple-900/40 px-3 py-1.5 rounded-lg border border-purple-500/30"><Text className="text-purple-300 text-sm">{genre}</Text></View>))}</View>
              </View>
            )}
            {contenidoserie.descripcion && (<View className="bg-slate-800 p-4 rounded-xl border border-slate-700"><Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Descripción</Text><Text className="text-gray-300 text-base leading-6">{contenidoserie.descripcion}</Text></View>)}
            {seriesResource.reseña && (<View className="bg-slate-800 p-4 rounded-xl border border-slate-700"><Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Tu reseña</Text><Text className="text-gray-300 text-base leading-6">{seriesResource.reseña}</Text></View>)}
            <View className="bg-slate-800 p-4 rounded-xl border border-slate-700"><Text className="text-purple-400 text-sm font-bold mb-2 uppercase">Agregado a tu colección</Text><View className="flex-row items-center"><MaterialCommunityIcons name="calendar-plus" size={20} color="#8b5cf6" /><Text className="text-white text-sm ml-2">{new Date(seriesResource.fechacreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></View></View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

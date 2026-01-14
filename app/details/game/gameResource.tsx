import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResource } from 'context/ResourceContext';
import { GameResource } from 'app/types/Resources';


export default function GameDetail() {
  const { item } = useLocalSearchParams();
  const {borrarRecurso} = useResource();

  const router = useRouter();
  
  let gameResource: GameResource | null = null;
  
  try {
    gameResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const handleDelete = () => {
	if (gameResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este videojuego de tu colección?', [
			{ text: 'Confirmar', onPress: () => {borrarRecurso(gameResource.id, 'videojuego'); router.push('/collection')} },
			{ text: 'Cancelar', style: 'cancel' }
		]);
	}
  };

  if (!gameResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryText text-center mt-2">No se pudo cargar la información del videojuego</Text>
        </View>
      </Screen>
    );
  }

  const { contenidovideojuego } = gameResource;
  const releaseYear = contenidovideojuego.fechaLanzamiento ? new Date(contenidovideojuego.fechaLanzamiento).getFullYear() : 'N/A';
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'Jugando';
      case 'COMPLETADO': return 'Completado';
      case 'ABANDONADO': return 'Abandonado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-borderButton';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      case 'ABANDONADO': return 'bg-orange-600';
      default: return 'bg-borderButton';
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surfaceButton border border-borderButton"
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-primaryText text-xl font-bold flex-1" numberOfLines={1}>
              Detalle del videojuego
            </Text>
          </View>
          
          {/* Botón de eliminar */}
          <TouchableOpacity 
            onPress={handleDelete}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-600 border border-red-500"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Imagen del videojuego */}
        <View className="px-4 mb-4">
          <Image 
            source={{ uri: contenidovideojuego.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          {/* Título y año */}
          <View className="mb-4">
            <Text className="text-primaryText text-3xl font-bold mb-2">
              {contenidovideojuego.titulo || 'Sin título'}
            </Text>
            
            <View className="flex-row items-center flex-wrap gap-2">
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg border border-borderButton">
                <Text className="text-secondaryText text-sm font-semibold">
                  {releaseYear}
                </Text>
              </View>

              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(gameResource.estado)}`}>
                <Text className="text-primaryText text-xs font-bold uppercase">
                  {getStatusText(gameResource.estado)}
                </Text>
              </View>

              {gameResource.favorito && (
                <View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center">
                  <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                  <Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text>
                </View>
              )}

              {gameResource.horasJugadas > 0 && (
                <View className="bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 flex-row items-center">
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#a855f7" />
                  <Text className="text-primary text-xs font-bold ml-1">
                    {gameResource.horasJugadas}h
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="gap-4 mb-6">
            {gameResource.calificacion > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Tu calificación</Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome5
                      key={star}
                      name="star"
                      size={20}
                      color={star <= gameResource.calificacion ? '#fbbf24' : '#475569'}
                      solid={star <= gameResource.calificacion}
                      style={{ marginRight: 4 }}
                    />
                  ))}
                  <Text className="text-primaryText text-lg font-bold ml-2">{gameResource.calificacion}/5</Text>
                </View>
              </View>
            )}

            {contenidovideojuego.calificacion && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Calificación general</Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="star" size={24} color="#fbbf24" />
                  <Text className="text-primaryText text-lg font-bold ml-2">
                    {contenidovideojuego.calificacion.toFixed(1)}/10
                  </Text>
                </View>
              </View>
            )}

            {gameResource.dificultad && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Dificultad</Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="speedometer" size={24} color="#8b5cf6" />
                  <Text className="text-primaryText text-lg font-bold ml-2">{gameResource.dificultad}</Text>
                </View>
              </View>
            )}

            {(gameResource.fechaInicio || gameResource.fechaFin) && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-3 uppercase">Periodo de juego</Text>
                <View className="gap-2">
                  {gameResource.fechaInicio && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="calendar-start" size={20} color="#8b5cf6" />
                      <Text className="text-secondaryText text-sm ml-2 mr-2">Inicio:</Text>
                      <Text className="text-primaryText text-sm font-semibold">
                        {new Date(gameResource.fechaInicio).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </Text>
                    </View>
                  )}
                  {gameResource.fechaFin && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="calendar-end" size={20} color="#8b5cf6" />
                      <Text className="text-secondaryText text-sm ml-2 mr-2">Fin:</Text>
                      <Text className="text-primaryText text-sm font-semibold">
                        {new Date(gameResource.fechaFin).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {contenidovideojuego.autor && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Desarrollador</Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="domain" size={24} color="#8b5cf6" />
                  <Text className="text-primaryText text-base ml-2">{contenidovideojuego.autor}</Text>
                </View>
              </View>
            )}

            {contenidovideojuego.genero && contenidovideojuego.genero.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Géneros</Text>
                <View className="flex-row flex-wrap gap-2">
                  {contenidovideojuego.genero.map((genre, index) => (
                    <View key={index} className="bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30">
                      <Text className="text-primary text-sm">{genre}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {contenidovideojuego.plataformas && contenidovideojuego.plataformas.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Plataformas</Text>
                <Text className="text-secondaryText text-base leading-6">
                  {contenidovideojuego.plataformas.join(', ')}
                </Text>
              </View>
            )}

            {contenidovideojuego.modosJuego && contenidovideojuego.modosJuego.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Modos de juego</Text>
                <Text className="text-secondaryText text-base leading-6">
                  {contenidovideojuego.modosJuego.join(', ')}
                </Text>
              </View>
            )}

            {contenidovideojuego.descripcion && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Descripción</Text>
                <Text className="text-secondaryText text-base leading-6">{contenidovideojuego.descripcion}</Text>
              </View>
            )}

            {gameResource.reseña && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-primary text-sm font-bold mb-2 uppercase">Tu reseña</Text>
                <Text className="text-secondaryText text-base leading-6">{gameResource.reseña}</Text>
              </View>
            )}

            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
              <Text className="text-primary text-sm font-bold mb-2 uppercase">Agregado a tu colección</Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="calendar-plus" size={20} color="#8b5cf6" />
                <Text className="text-primaryText text-sm ml-2">
                  {new Date(gameResource.fechacreacion).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

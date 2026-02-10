import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Game } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export default function GameDetail() {
  const { gameData } = useLocalSearchParams();
  const router = useRouter();
  const game: Game = JSON.parse(gameData as string);
  const { colors } = useTheme();

  const openForm = (game: Game) => {
	router.push({
	  pathname: '/form/game',
	  params: { gameData: JSON.stringify(game) }
	});
  }

  const ratingValue = (rating: Float) => {
    if (!rating) return null;
    return (rating/20).toFixed(1);
  }

  if (!game) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error}/>
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color: colors.secondaryText}}>No se pudo cargar la información del videojuego</Text>
        </View>
      </Screen>
    );
  }

  const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ReturnButton route="/Add?initialCategory=videojuego" title="Detalle del videojuego" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: game.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[600px] rounded-2xl"
            style={{backgroundColor: colors.surfaceButton}}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          <Text className="text-3xl font-bold mb-4" style={{color: colors.primaryText}}>
            {game.title || 'Sin título'}
          </Text>

          <View className="flex-row items-stretch flex-wrap gap-2 mb-4">
            <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor: colors.surfaceButton}}>
              <Text className="text-sm font-semibold" style={{color: colors.markerText}}>
                {releaseYear}
              </Text>
            </View>

            {game.rating && (
              <View className="px-3 py-1.5 rounded-lg border flex-row justify-center items-center" style={{backgroundColor: colors.surfaceButton, borderColor: colors.rating}}>
                <MaterialCommunityIcons name="star" size={20} color={colors.rating} />
                <Text className="text-sm font-bold ml-1" style={{color: colors.markerText}}>
                  {ratingValue(game.rating)}
                </Text>
              </View>
            )}

            {game.genre && game.genre.length > 0 && (
              <View className="px-3 py-1.5 rounded-lg" style= {{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm" style={{color: colors.markerText}}>
                  {game.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {game.autor && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Desarrollador
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="domain" size={24} color={colors.primary} />
                <Text className="text-secondaryText text-base ml-3">
                  {game.autor}
                </Text>
              </View>
            </View>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Plataformas
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-secondaryText text-base leading-6">
                  {game.platforms.join(', ')}
                </Text>
              </View>
            </View>
          )}

          {game.gamemodes && game.gamemodes.length > 0 && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Modos de Juego
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-secondaryText text-base leading-6">
                  {game.gamemodes.join(', ')}
                </Text>
              </View>
            </View>
          )}

          {game.releaseDate && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Fecha de Lanzamiento
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
                <Text className="text-secondaryText text-base ml-3">
                  {new Date(game.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          {game.description && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Descripción
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-secondaryText text-base leading-6">
                  {game.description}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => openForm(game)} 
            className="flex-1 bg-primary py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-primaryText font-bold">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

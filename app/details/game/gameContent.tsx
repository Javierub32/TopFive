import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface Game {
  id: number;
  title: string;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  description: string | null;
  rating: number | null;
  platforms: string[] | null;
  gamemodes: string[] | null;
}

export default function GameDetail() {
  const { gameData } = useLocalSearchParams();
  const router = useRouter();
  const game: Game = JSON.parse(gameData as string);

  const openForm = (game: Game) => {
	router.push({
	  pathname: '/form/game',
	  params: { gameData: JSON.stringify(game) }
	});
  }

  if (!game) {
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

  const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity 
            onPress={() => router.push("/Search")}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surfaceButton border border-borderButton"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-primaryText text-xl font-bold flex-1" numberOfLines={1}>
            Detalle del videojuego
          </Text>
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: game.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-primaryText text-3xl font-bold mb-3">
            {game.title}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mr-2 mb-2 border border-borderButton">
              <Text className="text-secondaryText text-sm font-semibold">
                {releaseYear}
              </Text>
            </View>

            {game.rating && (
              <View className="bg-primary/30 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-primary/30 flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                <Text className="text-primary text-sm font-bold ml-1">
                  {game.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {game.genre && game.genre.length > 0 && (
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mb-2 border border-borderButton">
                <Text className="text-secondaryText text-sm">
                  {game.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {game.autor && (
            <View className="mb-6">
              <Text className="text-primary text-lg font-bold mb-2">
                Desarrollador
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="domain" size={24} color="#8b5cf6" />
                <Text className="text-secondaryText text-base ml-3">
                  {game.autor}
                </Text>
              </View>
            </View>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <View className="mb-6">
              <Text className="text-primary text-lg font-bold mb-2">
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
              <Text className="text-primary text-lg font-bold mb-2">
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
              <Text className="text-primary text-lg font-bold mb-2">
                Fecha de Lanzamiento
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color="#8b5cf6" />
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
              <Text className="text-primary text-lg font-bold mb-2">
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
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-primaryText font-bold">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

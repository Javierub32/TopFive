import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Song } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';

export default function SongDetail() {
  const { songData } = useLocalSearchParams();
  const router = useRouter();
  const song: Song = JSON.parse(songData as string);
  const { colors } = useTheme();

  const openForm = (song: Song) => {
	router.push({
	  pathname: '/form/song',
	  params: { songData: JSON.stringify(song) }
	});
  }

  if (!song) {
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

  const releaseYear = song.releaseDate ? new Date(song.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

		<ReturnButton route="/Add?initialCategory=cancion" title="Detalle de la canción" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: song.imageFull || song.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-primaryText text-3xl font-bold mb-3">
            {song.title || 'Sin título'}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mr-2 mb-2 border border-borderButton">
              <Text className="text-secondaryText text-sm font-semibold">
                {releaseYear}
              </Text>
            </View>

            {song.genre && (
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mb-2 border border-borderButton">
                <Text className="text-secondaryText text-sm">
                  {song.genre}
                </Text>
              </View>
            )}
          </View>

          {song.autor && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Artista
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="account-music" size={24} color={colors.primary} />
                <Text className="text-secondaryText text-base ml-3">
                  {song.autor}
                </Text>
              </View>
            </View>
          )}

          {song.album && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Álbum
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="album" size={24} color={colors.primary} />
                <Text className="text-secondaryText text-base ml-3">
                  {song.album}
                </Text>
              </View>
            </View>
          )}

          {song.releaseDate && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Fecha de Lanzamiento
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
                <Text className="text-secondaryText text-base ml-3">
                  {new Date(song.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => {openForm(song);}} 
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

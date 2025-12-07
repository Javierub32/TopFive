import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface Song {
  id: number;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string | null;
  reference: string | null;
  autorId: number | null;
  imageFull: string | null;
  album: string | null;
}

export default function SongDetail() {
  const { songData } = useLocalSearchParams();
  const router = useRouter();
  const song: Song = JSON.parse(songData as string);

  if (!song) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-white text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-gray-400 text-center mt-2">No se pudo cargar la información de la canción</Text>
        </View>
      </Screen>
    );
  }

  const releaseYear = song.releaseDate ? new Date(song.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1" numberOfLines={1}>
            Detalle de la canción
          </Text>
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: song.imageFull || song.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-slate-900"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-white text-3xl font-bold mb-3">
            {song.title || 'Sin título'}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-slate-800 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-slate-700">
              <Text className="text-gray-300 text-sm font-semibold">
                {releaseYear}
              </Text>
            </View>

            {song.genre && (
              <View className="bg-slate-800 px-3 py-1.5 rounded-lg mb-2 border border-slate-700">
                <Text className="text-gray-300 text-sm">
                  {song.genre}
                </Text>
              </View>
            )}
          </View>

          {song.autor && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Artista
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="account-music" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
                  {song.autor}
                </Text>
              </View>
            </View>
          )}

          {song.album && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Álbum
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="album" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
                  {song.album}
                </Text>
              </View>
            </View>
          )}

          {song.releaseDate && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Fecha de Lanzamiento
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
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
            onPress={() => {}} 
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

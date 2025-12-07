import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface Series {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
  ended: string | null;
}

export default function SeriesDetail() {
  const { seriesData } = useLocalSearchParams();
  const router = useRouter();
  const series: Series = JSON.parse(seriesData as string);

  if (!series) {
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

  const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : 'N/A';
  const endedYear = series.ended ? new Date(series.ended).getFullYear() : null;

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
            Detalle de la serie
          </Text>
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: series.imageFull || series.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-slate-900"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-white text-3xl font-bold mb-3">
            {series.title}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-slate-800 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-slate-700">
              <Text className="text-gray-300 text-sm font-semibold">
                {endedYear ? `${releaseYear} - ${endedYear}` : `${releaseYear} - Presente`}
              </Text>
            </View>

            {series.rating && (
              <View className="bg-purple-900/60 px-3 py-1.5 rounded-lg mr-2 mb-2 border border-purple-500/30 flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                <Text className="text-purple-300 text-sm font-bold ml-1">
                  {series.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {series.genre && series.genre.length > 0 && (
              <View className="bg-slate-800 px-3 py-1.5 rounded-lg mb-2 border border-slate-700">
                <Text className="text-gray-300 text-sm">
                  {series.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {series.releaseDate && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Fecha de Estreno
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
                  {new Date(series.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          {series.ended && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Fecha de Finalización
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row items-center">
                <MaterialCommunityIcons name="calendar-check" size={24} color="#8b5cf6" />
                <Text className="text-gray-300 text-base ml-3">
                  {new Date(series.ended).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          {series.description && (
            <View className="mb-6">
              <Text className="text-purple-400 text-lg font-bold mb-2">
                Sinopsis
              </Text>
              <View className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <Text className="text-gray-300 text-base leading-6">
                  {series.description}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => {}} 
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" />
            <Text className="text-white font-bold ml-2">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

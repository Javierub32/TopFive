import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/colors';
import { Series } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';

export default function SeriesDetail() {
  const { seriesData } = useLocalSearchParams();
  const router = useRouter();
  const series: Series = JSON.parse(seriesData as string);

  const openForm = (series: Series) => {
	router.push({
	  pathname: '/form/series',
	  params: { seriesData: JSON.stringify(series) }
	});
  }

  if (!series) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryText text-center mt-2">No se pudo cargar la información de la serie</Text>
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
        <ReturnButton route="/Add?initialCategory=Series" title="Detalle de la serie" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: series.imageFull || series.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-primaryText text-3xl font-bold mb-3">
            {series.title}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mr-2 mb-2 border border-borderButton">
              <Text className="text-secondaryText text-sm font-semibold">
                {endedYear ? `${releaseYear} - ${endedYear}` : `${releaseYear} - Presente`}
              </Text>
            </View>

            {series.rating && (
              <View className="bg-marker px-3 py-1.5 rounded-lg mr-2 mb-2 border border-primary/30 flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                <Text className="text-markerText text-sm font-bold ml-1">
                  {series.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {series.genre && series.genre.length > 0 && (
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg mb-2 border border-borderButton">
                <Text className="text-secondaryText text-sm">
                  {series.genre.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {series.releaseDate && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Fecha de Estreno
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="calendar" size={24} color={COLORS.primary} />
                <Text className="text-secondaryText text-base ml-3">
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
              <Text className="text-title text-lg font-bold mb-2">
                Fecha de Finalización
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton flex-row items-center">
                <MaterialCommunityIcons name="calendar-check" size={24} color={COLORS.primary} />
                <Text className="text-secondaryText text-base ml-3">
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
              <Text className="text-title text-lg font-bold mb-2">
                Sinopsis
              </Text>
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-secondaryText text-base leading-6">
                  {series.description}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => openForm(series)} 
            className="flex-1 bg-primary py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" />
            <Text className="text-primaryText font-bold ml-2">Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

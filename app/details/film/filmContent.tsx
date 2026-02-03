import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Film } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';

export default function FilmDetail() {
  const { filmData } = useLocalSearchParams();
  const router = useRouter();
  const film: Film = JSON.parse(filmData as string);
  const { colors } = useTheme();

  const openForm = (film: Film) => {
    router.push({
      pathname: '/form/film',
      params: { filmData: JSON.stringify(film) },
    });
  };

  if (!film) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error()} />
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color: colors.secondaryText}}>No se pudo cargar la información de la película</Text>
        </View>
      </Screen>
    );
  }

  const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ReturnButton route="/Add?initialCategory=Películas" title="Detalle de la película" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: film.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-3xl font-bold mb-3" style={{color: colors.primaryText}}>
            {film.title}
          </Text>

          <View className="flex-row items-center mb-4 flex-wrap">
            {!!film.rating && (
              <View className="px-3 py-1.5 rounded-lg mr-2 mb-2 border flex-row items-center" style={{borderColor: colors.primary, backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="star" size={16} color={colors.rating} />
                <Text className="text-sm font-bold ml-1" style={{color: colors.markerText}}>
                  {film.rating.toFixed(1)}
                </Text>
              </View>
            )}

            <View className="px-3 py-1.5 rounded-lg mr-2 mb-2 border" style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton}}>
              <Text className="text-sm font-semibold" style={{color: colors.secondaryText}}>
                {releaseYear}
              </Text>
            </View>      
          </View>

		      {film.releaseDate && (
            <View className="mb-6">
              <Text className="text-title text-lg font-bold mb-2">
                Fecha de Estreno
              </Text>
              <View className="p-4 rounded-xl border flex-row items-center" style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="calendar" size={24} color={colors.accent} />
                <Text className="text-base ml-3" style={{color: colors.secondaryText}}>
                  {new Date(film.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}

          {film.description && (
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2" style={{color: colors.title}}>
                Sinopsis
              </Text>
              <View className="p-4 rounded-xl border" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <Text className="text-base leading-6" style={{color: colors.secondaryText}}>
                  {film.description}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity 
            onPress={() => {openForm(film)}}
            className="flex-1 py-4 rounded-xl items-center flex-row justify-center"
            style={{backgroundColor: `${colors.primary}`}}
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color={colors.background} style={{marginRight: 8}} />
            <Text className="font-bold" style={{color: colors.background}}>Añadir a colección</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

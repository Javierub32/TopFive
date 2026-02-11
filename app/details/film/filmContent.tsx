import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Film } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { DescriptionCard } from "@/Details/components/DescriptionCard";
import { ContentTags } from "@/Details/components/ContentTags";
import { ContentDateCard } from "@/Details/components/ContentDateCard";
import { AddToCollectionButton } from "@/Details/components/AddToCollectionButton";

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

  const ratingValue = (rating: Float) => {
    if (!rating) return null;
    return (rating/2).toFixed(1);
  }

  if (!film) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color: colors.secondaryText}}>No se pudo cargar la información de la película</Text>
        </View>
      </Screen>
    );
  }

  const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() : 'N/A';

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ReturnButton route="/Add?initialCategory=pelicula" title="Detalle de la película" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: film.image || 'https://via.placeholder.com/500x750' }}
            className="aspect-[2/3] rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>
        
        <View className="px-4 mb-14 pb-6">
          <ContentTags content={film} type='pelicula'/>
          <View className='flex-col justify-between gap-3'>
            <ContentDateCard releaseDate={film.releaseDate}/>
            <DescriptionCard description={film.description}/>
          </View>
          <AddToCollectionButton content={film} type='pelicula' data={filmData}/>
        </View>
      </ScrollView>
    </Screen>
  );
}

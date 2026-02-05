import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Film } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { cleanHtmlDescription } from '@/Details/utils/descriptionUtils';

export default function FilmDetail() {
  const { filmData } = useLocalSearchParams();
  const router = useRouter();
  const film: Film = JSON.parse(filmData as string);
  const { colors } = useTheme();
  
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const MAX_LENGTH = 200;
  const shouldTruncate = film.description && film.description.length > MAX_LENGTH;
  const rawDescription = film.description || 'Sin descripción disponible.';
  const descriptionText = cleanHtmlDescription(rawDescription);
  const displayedDescription = shouldTruncate && !isExpanded
    ? descriptionText.slice(0, MAX_LENGTH) + '...'
    : descriptionText;

  const openForm = (film: Film) => {
    router.push({
      pathname: '/form/film',
      params: { filmData: JSON.stringify(film) },
    });
  };

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
        <ReturnButton route="/Add?initialCategory=Películas" title="Detalle de la película" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: film.image || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl"
            style={{ backgroundColor: colors.background }}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14">
          <Text className="text-3xl font-bold mb-3" style={{color: colors.primaryText}}>
            {film.title || 'Sin título'}
          </Text>

          <View className="flex-row items-stretch mb-4 flex-wrap gap-2">
            <View className="px-3 py-1.5 rounded-lg justify-center" 
            style={{ backgroundColor: colors.surfaceButton}}>
              <Text className="text-sm font-semibold" style={{color: colors.markerText}}>
                {releaseYear}
              </Text>
            </View>  

            {!!film.rating && (
              <View className="px-3 py-1.5 rounded-lg flex-row items-center" style={{backgroundColor: colors.surfaceButton, borderColor: colors.rating}}>
                <MaterialCommunityIcons name="star" size={20} color={colors.rating} />
                <Text className="text-sm font-bold ml-1" style={{color: colors.markerText}}>
                  {film.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <View className='flex-col justify-between gap-3'>
            {film.releaseDate && (
              <View className="p-4 rounded-2xl flex justify-between gap-2" style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold uppercase tracking-widest" style={{color:colors.title}}>
                    Publicado
                  </Text>
                </View>
                <Text className="text-base ml-3" style={{color: colors.secondaryText}}>
                  {new Date(film.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            )}

            {descriptionText && (
              <View className='p-5 rounded-2xl space-y-3 border-l-4' style={{backgroundColor: colors.surfaceButton, borderColor:colors.borderButton}}>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary}/>
                  <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.title}}>Sinopsis</Text>
                </View>
                <Text style={{color: colors.secondaryText}}>
                  <Text className='leading-relaxed italic'>
                    {displayedDescription}
                  </Text>
                  {shouldTruncate && (
                    <Text className='font-bold' style= {{ color: colors.primary}} onPress={() => setIsExpanded(!isExpanded)}>
                      {isExpanded? 'Leer menos' : 'Leer más'}
                    </Text>
                  )}
                </Text>
              </View>
            )}
          </View>

		      
          <TouchableOpacity 
            onPress={() => {openForm(film)}}
            className="flex-1 py-4 rounded-xl items-center flex-row justify-center mt-4"
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

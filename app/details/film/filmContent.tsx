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
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ModernContentHeader } from "@/Details/components/ContentHeader";
import { ContentRating } from "@/Details/components/ContentRating";
import { AdBanner } from 'components/AdBanner';

export default function FilmDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'pelicula');
  const film: Film = content as Film;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=pelicula' : '/(tabs)/Home';

  

  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  if (!film && !loading) {
    return (
      <Screen>
        <ThemedStatusBar/>
		<ReturnButton route={path} title="Detalle de la película" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{color: colors.secondaryText}}>No se pudo cargar la información de la película</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar/>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ModernContentHeader
          imageUrl={film.image}
          returnRoute={path}
          content={film}
          type='pelicula'
          autor={null}
        />

        <View className="mb-14 px-4 pb-6">        
          <View className="flex-col justify-between gap-3 mt-1">
            <ContentRating content={film} type='pelicula' />
            <DescriptionCard description={film.description}/>
          </View>
          <AddToCollectionButton content={film} type='pelicula'/>
        </View>
      </ScrollView>
	  <AdBanner/>
    </Screen>
  );
}

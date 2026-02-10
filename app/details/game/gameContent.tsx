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
import { ContentTags } from "@/Details/components/ContentTags";
import { AuthorCard } from "@/Details/components/AuthorCard";
import { ContentDateCard } from "@/Details/components/ContentDateCard";
import { DescriptionCard } from "@/Details/components/DescriptionCard";
import { AddToCollectionButton } from "@/Details/components/AddToCollectionButton";
import { ExtraCard } from "@/Details/components/ExtraCard";

export default function GameDetail() {
  const { gameData } = useLocalSearchParams();
  const game: Game = JSON.parse(gameData as string);
  const { colors } = useTheme();


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


  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ReturnButton route="/Add?initialCategory=videojuego" title="Detalle del videojuego" />

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: game.image || 'https://via.placeholder.com/500x750' }}
            className="aspect-[2/3] rounded-2xl"
            style={{backgroundColor: colors.surfaceButton}}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6 gap-3">
          <ContentTags content={game} type='videojuego'/>
          <View className="flex-row gap-2">
            <AuthorCard autor={game.autor}/>
            <ContentDateCard releaseDate={game.releaseDate}/>
          </View>
          <ExtraCard extra={game.gamemodes} type='videojuego'/>
          <DescriptionCard description={game.description}/>
          <AddToCollectionButton content={game} type='videojuego'/>
        </View>
      </ScrollView>
    </Screen>
  );
}

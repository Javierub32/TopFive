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
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContent } from '@/Details/hooks/useContent';
import { ModernContentHeader } from "@/Details/components/ContentHeader";

export default function GameDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'videojuego');
  const game: Game = content as Game;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=videojuego' : '/(tabs)/Home';


  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }


  if (!game && !loading) {
    return (
      <Screen>
        <ThemedStatusBar/>
		<ReturnButton route={path} title="Detalle del videojuego" />
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
        <ModernContentHeader
          imageUrl={game.image}
          returnRoute={path}
          content={game}
          type='videojuego'
          autor={game.autor}
        />

        <View className="mb-14 px-4 pb-6">        
          <View className="flex-col justify-between gap-3 mt-1">
            <ExtraCard extra={game.gamemodes} type='videojuego'/>
            <DescriptionCard description={game.description}/>
          </View>
          <AddToCollectionButton content={game} type='videojuego'/>
        </View>
      </ScrollView>
    </Screen>
  );
}

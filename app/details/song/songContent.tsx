import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Song } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { ContentTags } from "@/Details/components/ContentTags";
import { AuthorCard } from "@/Details/components/AuthorCard";
import { ContentDateCard } from "@/Details/components/ContentDateCard";
import { AddToCollectionButton } from "@/Details/components/AddToCollectionButton";
import { ExtraCard } from "@/Details/components/ExtraCard";
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContent } from '@/Details/hooks/useContent';

export default function SongDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'cancion');
  const song: Song = content as Song;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=cancion' : '/(tabs)/Home';


  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  if (!song && !loading) {
    return (
      <Screen>
        <StatusBar style="light" />
		<ReturnButton route={path} title="Detalle de la canción" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryText text-center mt-2">No se pudo cargar la información de la canción</Text>
        </View>
      </Screen>
    );
  }


  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View>
          <ReturnButton route={path} title="Detalle de la canción" />
        </View>

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: song.imageFull || song.image || 'https://via.placeholder.com/500x750' }}
            className="aspect-[2/3] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14 pb-6 gap-3">
          <ContentTags content={song} type='cancion'/>
          <View className="flex-row gap-2">
            <AuthorCard autor={song.autor}/>
            <ContentDateCard releaseDate={song.releaseDate}/>
          </View>

          <ExtraCard extra={song.album} type='cancion'/>
          <AddToCollectionButton content={song} type='cancion'/>
        </View>
      </ScrollView>
    </Screen>
  );
}

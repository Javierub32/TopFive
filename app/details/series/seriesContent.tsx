import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Series } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ContentTags } from "@/Details/components/ContentTags";
import { DescriptionCard } from "@/Details/components/DescriptionCard";
import { AddToCollectionButton } from "@/Details/components/AddToCollectionButton";
import { ContentDateCard } from "@/Details/components/ContentDateCard";
import { ThemedStatusBar } from "components/ThemedStatusBar";

export default function SeriesDetail() {
  const { seriesData } = useLocalSearchParams();
  const series: Series = JSON.parse(seriesData as string);
  const { colors } = useTheme();

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

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2 pb-4">
          <ReturnButton route="/Add?initialCategory=serie" title="Detalle de la serie" style={' '}/>
        </View>
        

        <View className="px-4 mb-4">
          <Image 
            source={{ uri: series.imageFull || series.image || 'https://via.placeholder.com/500x750' }}
            className="aspect-[2/3] rounded-2xl"
            style={{backgroundColor: colors.surfaceButton}}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 mb-14 pb-6">
          <ContentTags content={series} type='serie'/>
          <View className="flex justify-between gap-3">
            <ContentDateCard releaseDate={series.releaseDate}/>
            <DescriptionCard description={series.description}/>   
          </View>
          <AddToCollectionButton content={series} type='serie'/>
        </View>
      </ScrollView>
    </Screen>
  );
}

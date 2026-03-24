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
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ModernContentHeader } from "@/Details/components/ContentHeader";
import { ContentRating } from "@/Details/components/ContentRating";
import { AdBanner } from 'components/AdBanner';

export default function SeriesDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'serie');
  const series: Series = content as Series;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=serie' : '/(tabs)/Home';

  

  if (loading) {
	return (
	  <Screen>
		<LoadingIndicator />
	  </Screen>
	);
  }

  if (!series && !loading) {
    return (
      <Screen>
        <StatusBar style="light" />
		<ReturnButton route={path} title="Detalle de la serie" />
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
        <ModernContentHeader
          imageUrl={series.imageFull || series.image}
          returnRoute={path}
          content={series}
          type='serie'
          autor={null}
        />

        <View className="mb-14 px-4 pb-6">        
          <View className="flex-col justify-between gap-3 mt-1">
            <ContentRating content={series} type='serie'/>
            <DescriptionCard description={series.description}/>   
          </View>
          <AddToCollectionButton content={series} type='serie'/>
        </View>
		<AdBanner/>
      </ScrollView>
    </Screen>
  );
}

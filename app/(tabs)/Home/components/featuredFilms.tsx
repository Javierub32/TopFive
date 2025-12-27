import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RenderContent from './renderContent';

export default function FeaturedFilms({ featured }: { featured: any[] }) {
  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name="film" size={24} color="#9ca3af" />
        <Text className="mb-4 text-lg font-semibold text-white"> Películas populares </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {featured.map((film) => (
          <RenderContent key={film.id} item={film} variant="vertical" />
        ))}
      </ScrollView>
    </View>
  );
}

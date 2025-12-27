import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RenderContent from './renderContent';

export default function FeaturedSeries({ featured }: { featured: any[] }) {
  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name="video-vintage" size={24} color="#9ca3af" />
        <Text className="mb-4 text-lg font-semibold text-white"> Series populares </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {featured.map((series) => (
          <RenderContent key={series.id} item={series} variant="vertical" />
        ))}
      </ScrollView>
    </View>
  );
}

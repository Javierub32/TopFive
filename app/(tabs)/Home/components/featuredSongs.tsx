import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RenderContent, { RenderSong } from './renderContent';

export default function FeaturedSongs({ featured }: { featured: any[] }) {
  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name="music" size={24} color="#9ca3af" />
        <Text className="mb-4 text-lg font-semibold text-white"> Canciones populares </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {featured.map((song) => (
          <RenderSong key={song.id} song={song} />
        ))}
      </ScrollView>
    </View>
  );
}

import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FeaturedSectionProps {
  icon: any;
  title: string;
  children: React.ReactNode;
}

export default function FeaturedSection({ icon, title, children }: FeaturedSectionProps) {
  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name={icon} size={24} color="#9ca3af" />
        <Text className="mb-4 text-lg font-semibold text-primaryText">{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {children}
      </ScrollView>
    </View>
  );
}

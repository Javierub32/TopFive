import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/colors';

interface FeaturedSectionProps {
  icon: any;
  title: string;
  children: React.ReactNode;
}

export default function FeaturedSection({ icon, title, children }: FeaturedSectionProps) {
  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.secondaryText} />
        <Text className="mb-4 text-lg font-semibold text-primaryText">{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {children}
      </ScrollView>
    </View>
  );
}

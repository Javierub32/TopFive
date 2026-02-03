import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import colors from 'tailwindcss/colors';

interface FeaturedSectionProps {
  icon: any;
  title: string;
  children: React.ReactNode;
}

export default function FeaturedSection({ icon, title, children }: FeaturedSectionProps) {
  const { colors } = useTheme();

  return (
    <View className="px-4">
      <View className="mb-4 flex-row space-x-4">
        <MaterialCommunityIcons name={icon} size={24} color={colors.secondaryText} />
        <Text className="mb-4 text-lg font-semibold" style={{color: colors.primaryText}}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {children}
      </ScrollView>
    </View>
  );
}

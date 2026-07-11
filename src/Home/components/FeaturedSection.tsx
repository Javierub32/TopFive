import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import {AppText} from 'components/AppText';
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
        <ScalableMaterialCommunityIcons name={icon} size={24} color={colors.secondaryText} />
        <AppText className="mb-4 font-semibold" style={{color: colors.primaryText, fontSize: 18}}>{title}</AppText>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {children}
      </ScrollView>
    </View>
  );
}

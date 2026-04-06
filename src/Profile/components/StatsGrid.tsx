import { useTheme } from 'context/ThemeContext';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  title: string;
  total: number;
  average: number;
  onPress?: () => void;
}

export const StatsGrid = ({ title, total, average, onPress }: Props) => {
  const { colors } = useTheme();

  const TotalContainer = onPress ? TouchableOpacity : View;

  return (
    <View className="mb-6 flex-row gap-3 px-1">
      {/* Tarjeta de TOTAL */}
      <TotalContainer 
        className="flex-1 rounded-2xl p-4 shadow-sm "
        style={{ 
            backgroundColor: colors.surfaceButton, 
            borderColor: colors.borderButton 
        }}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View className="flex-row items-center justify-between mb-2">
            <View className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                <MaterialCommunityIcons name="chart-bar" size={20} color={colors.primary} />
            </View>
            <Text className="text-xs font-bold uppercase" style={{ color: colors.secondaryText }}>
                Total
            </Text>
        </View>
        
        <Text className="text-3xl font-bold mt-1" style={{ color: colors.primaryText }}>
            {total}
        </Text>
        <Text className="text-xs mt-1" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {title}
        </Text>
      </TotalContainer>

      {/* Tarjeta de PROMEDIO */}
      <View 
        className="flex-1 rounded-2xl p-4 shadow-sm "
        style={{ 
            backgroundColor: colors.surfaceButton, 
            borderColor: colors.borderButton 
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
            <View className="p-2 rounded-full" style={{ backgroundColor: `${colors.accent}20` }}>
                <MaterialCommunityIcons name="chart-timeline-variant" size={20} color={colors.accent} />
            </View>
            <Text className="text-xs font-bold uppercase" style={{ color: colors.secondaryText }}>
                Media
            </Text>
        </View>

        <Text className="text-3xl font-bold mt-1" style={{ color: colors.primaryText }}>
            {average}
        </Text>
        <Text className="text-xs mt-1" style={{ color: colors.secondaryText }}>
            Mensual
        </Text>
      </View>
    </View>
  );
};
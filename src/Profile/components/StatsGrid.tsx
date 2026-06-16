import { useTheme } from 'context/ThemeContext';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from 'components/Icons';
import {AppText} from 'components/AppText';
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
            <AppText className="text-xs font-bold uppercase" style={{ color: colors.secondaryText }}>
                Total
            </AppText>
        </View>
        
        <AppText className="text-3xl font-bold mt-1" style={{ color: colors.primaryText }}>
            {total}
        </AppText>
        <AppText className="text-xs mt-1" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {title}
        </AppText>
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
            <AppText className="text-xs font-bold uppercase" style={{ color: colors.secondaryText }}>
                Media
            </AppText>
        </View>

        <AppText className="text-3xl font-bold mt-1" style={{ color: colors.primaryText }}>
            {average}
        </AppText>
        <AppText className="text-xs mt-1" style={{ color: colors.secondaryText }}>
            Mensual
        </AppText>
      </View>
    </View>
  );
};
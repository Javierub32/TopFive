import { useTheme } from 'context/ThemeContext';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  title: string;
  total: number;
  average: number;
  onPress?: () => void;
}

export const StatsGrid = ({ title, total, average, onPress }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const TotalContainer = onPress ? TouchableOpacity : View;

  return (
    <View className="mb-6 flex-row gap-3 px-1">
      {/* Tarjeta de TOTAL */}
      <TotalContainer
        className="flex-1 rounded-2xl p-4 shadow-sm "
        style={{
          backgroundColor: colors.surfaceButton,
          borderColor: colors.borderButton,
        }}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}>
        <View className="mb-2 flex-row items-center justify-between">
          <View className="rounded-full p-2" style={{ backgroundColor: `${colors.primary}20` }}>
            <MaterialCommunityIcons name="chart-bar" size={20} color={colors.primary} />
          </View>
          <AppText className="font-bold uppercase" style={{ color: colors.secondaryText, fontSize: 18 }}>
            {t('profile.total')}
          </AppText>
        </View>

        <AppText className="mt-1 font-bold" style={{ color: colors.primaryText, fontSize: 24 }}>
          {total}
        </AppText>
        <AppText className="mt-1 " style={{ color: colors.secondaryText, fontSize: 14}} numberOfLines={1}>
          {title}
        </AppText>
      </TotalContainer>

      {/* Tarjeta de PROMEDIO */}
      <View
        className="flex-1 rounded-2xl p-4 shadow-sm "
        style={{
          backgroundColor: colors.surfaceButton,
          borderColor: colors.borderButton,
        }}>
        <View className="mb-2 flex-row items-center justify-between">
          <View className="rounded-full p-2" style={{ backgroundColor: `${colors.accent}20` }}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={20} color={colors.accent} />
          </View>
          <AppText className="font-bold uppercase" style={{ color: colors.secondaryText, fontSize: 18 }}>
            {t('profile.average')}
          </AppText>
        </View>

        <AppText className="mt-1 font-bold" style={{ color: colors.primaryText, fontSize: 24 }}>
          {average}
        </AppText>
        <AppText className="mt-1 text-xs" style={{ color: colors.secondaryText, fontSize: 14 }}>
          {t('profile.monthly')}
        </AppText>
      </View>
    </View>
  );
};

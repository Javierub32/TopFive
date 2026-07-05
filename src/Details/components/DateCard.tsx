import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { CalendarIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  startDate: string | Date | null | undefined;
  endDate?: string | Date | null | undefined;
  isRange: boolean;
}

export const DateCard = ({ startDate, endDate, isRange }: Props) => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const formatDate = (fecha: string | Date | null | undefined) => {
    if (!fecha) return '-';

    return new Date(fecha).toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!isRange) {
    return (
      <View
        className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
        style={{ backgroundColor: `${colors.primary}1A` }}>
        <View className="flex-row items-center gap-2">
          <CalendarIcon color={colors.primary} />
          <AppText
            className="font-bold uppercase tracking-widest"
            style={{ color: colors.markerText, fontSize: 14 }}>
            {t('details.lastTime')}
          </AppText>
        </View>
        <View className="flex-row items-baseline">
          <AppText className="ml-3 text-base" style={{ color: colors.secondaryText, fontSize: 14 }}>
            {formatDate(startDate)}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row gap-2">
      {/* CARD 4: Fecha Inicio (48% width) */}
      <View
        className="flex-1 space-y-2 rounded-2xl p-4"
        style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-row items-center gap-2">
          <CalendarIcon />
          <AppText
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.markerText }}>
            {t('details.start')}
          </AppText>
        </View>
        <View>
          <AppText className="text-md font-semibold" style={{ color: colors.primaryText }}>
            {formatDate(startDate)}
          </AppText>
        </View>
      </View>
      {/* CARD 5: Fecha Fin (48% width) */}
      <View
        className="flex-1 space-y-2 rounded-2xl p-4"
        style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-row items-center gap-2">
          <CalendarIcon />
          <AppText
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.markerText }}>
            {t('details.end')}
          </AppText>
        </View>
        <View>
          <AppText className="text-md font-semibold" style={{ color: colors.primaryText }}>
            {formatDate(endDate)}
          </AppText>
        </View>
      </View>
    </View>
  );
};

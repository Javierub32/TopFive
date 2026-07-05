import { CalendarIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { View } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Props {
  releaseDate: string | null;
}

export const ContentDateCard = ({ releaseDate }: Props) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const formateDate = () => {
    if (!releaseDate) return null;

    return new Date(releaseDate).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const newDate = formateDate();

  return (
    <View
      className="flex-1 justify-between rounded-2xl p-4"
      style={{ backgroundColor: `${colors.primary}1A` }}>
      <View className="flex-row items-center gap-2">
        <CalendarIcon />
        <AppText
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText, fontSize: 12 }}>
          {t('details.released')}
        </AppText>
      </View>
      <View className="flex-1 items-center justify-center">
        <AppText
          className="text-semibold text-base"
          style={{ color: colors.secondaryText, fontSize: 14 }}>
          {newDate}
        </AppText>
      </View>
    </View>
  );
};

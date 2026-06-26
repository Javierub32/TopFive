import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ProgressIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  progress: string | number;
  unit?: string;
}

export const ProgressCard = ({ progress, unit }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const splitProgress = () => {
    if (typeof progress === 'string') {
      return progress.split('-', 2);
    }
    return '-';
  };

  if (!!unit) {
    return (
      <View
        className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
        style={{ backgroundColor: `${colors.primary}1A` }}>
        <View className="flex-row items-center gap-2">
          <ProgressIcon />
          <AppText
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.markerText }}>
            {t('details.progress')}
          </AppText>
        </View>
        <View className="flex-row items-baseline">
          <AppText className="text-xl font-bold" style={{ color: colors.primaryText }}>
            {progress || 0}
          </AppText>
          <AppText className="ml-1 text-xs" style={{ color: colors.markerText }}>
            {unit}
          </AppText>
        </View>
      </View>
    );
  }

  const newProgress = splitProgress();
  return (
    <View
      className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
      style={{ backgroundColor: `${colors.primary}1A` }}>
      <View className="flex-row items-center gap-2">
        <ProgressIcon />
        <AppText
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          {t('details.progress')}
        </AppText>
      </View>
      <View className="flex-row items-baseline">
        <AppText className="text-xl font-bold" style={{ color: colors.primaryText }}>
          {t('details.seasonAbbreviation')}
          {newProgress[0]} - {t('details.episodeAbbreviation')}
          {newProgress[1]}
        </AppText>
      </View>
    </View>
  );
};

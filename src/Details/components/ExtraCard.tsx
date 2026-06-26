import { useTheme } from 'context/ThemeContext';
import { View } from 'react-native';
import { extraAdapter } from '@/Details/adapter/extraAdapter';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Props {
  extra: string[] | string | null;
  type: string;
}

export const ExtraCard = ({ extra, type }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getExtraText = () => {
    if (!!extra) {
      if (typeof extra === 'string') {
        return extra;
      }
      return extra.join(', ');
    }
    return null;
  };

  const extraText = getExtraText();
  const extraTitle = t(extraAdapter.getTitle(type) as any);
  const Icono = extraAdapter.getIcon(type);

  return (
    <View
      className="justify-between gap-2 rounded-2xl p-4"
      style={{ backgroundColor: `${colors.accent}33` }}>
      <View className="flex-row items-center gap-2">
        <Icono color={colors.accent} />
        <AppText
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          {extraTitle}
        </AppText>
      </View>
      <View className="flex-1 items-center justify-center">
        <AppText className="text-base font-semibold" style={{ color: colors.secondaryText }}>
          {extraText}
        </AppText>
      </View>
    </View>
  );
};

import { AuthorIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { View } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  autor: string | null;
}

export const AuthorCard = ({ autor }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex-1 justify-between gap-2 rounded-2xl p-4"
      style={{ backgroundColor: colors.surfaceButton }}>
      <View className="flex-row items-center gap-2">
        <AuthorIcon />
        <AppText
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          {t('details.author')}
        </AppText>
      </View>
      <View className="flex-1 items-center justify-center">
        <AppText className="text-base font-semibold" style={{ color: colors.secondaryText }}>
          {autor}
        </AppText>
      </View>
    </View>
  );
};

import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ScalableBookIcon, ScalableFilmIcon, ScalableShowIcon, ScalableGameIcon, ScalableMusicIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface FallbackCoverProps {
  type: ResourceType;
  fullSize: boolean;
  style?: any;
}

export const FallbackCover = ({ type, style, fullSize }: FallbackCoverProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getFallbackConfig = () => {
    switch (type) {
      case 'serie':
        return { Icon: ScalableShowIcon, text: t('components.noImage.serie') };
      case 'pelicula':
        return { Icon: ScalableFilmIcon, text: t('components.noImage.film') };
      case 'libro':
        return { Icon: ScalableBookIcon, text: t('components.noImage.book') };
      case 'videojuego':
        return { Icon: ScalableGameIcon, text: t('components.noImage.videogame') };
      case 'cancion':
        return { Icon: ScalableMusicIcon, text: t('components.noImage.album') };
      default:
        return { Icon: ScalableShowIcon, text: t('components.noImage.title') };
    }
  };

  const { Icon, text } = getFallbackConfig();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surfaceButton,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        },
        style,
      ]}>
      <Icon size={40} color={colors.primaryText} />
      {fullSize && (
        <AppText
          className="mt-2 text-center font-semibold"
          style={{ color: colors.primaryText, fontSize: 14 }}>
          {text}
        </AppText>
      )}
    </View>
  );
};

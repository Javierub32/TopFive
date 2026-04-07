import { View, Text } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';

interface FallbackCoverProps {
  type: ResourceType;
  fullSize: boolean;
  style?: any;
}

export const FallbackCover = ({ type, style, fullSize }: FallbackCoverProps) => {
  const { colors } = useTheme();

  const getFallbackConfig = () => {
    switch (type) {
      case 'serie':
        return { Icon: ShowIcon, text: 'Esta serie no tiene imagen' };
      case 'pelicula':
        return { Icon: FilmIcon, text: 'Esta película no tiene imagen' };
      case 'libro':
        return { Icon: BookIcon, text: 'Este libro no tiene imagen' };
      case 'videojuego':
        return { Icon: GameIcon, text: 'Este juego no tiene imagen' };
      case 'cancion':
        return { Icon: MusicIcon, text: 'Este álbum no tiene imagen' };
      default:
        return { Icon: ShowIcon, text: 'Sin imagen' };
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
        <Text
          className="mt-2 text-center text-xs font-semibold"
          style={{ color: colors.primaryText }}>
          {text}
        </Text>
      )}
    </View>
  );
};

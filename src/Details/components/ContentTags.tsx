import { View } from 'react-native';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
  autor?: string | null;
}

export const ContentTags = ({ content, type, autor }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const releaseYear = content.releaseDate ? new Date(content.releaseDate).getFullYear() : 'N/A';

  const getEnded = () => {
    if ('ended' in content && content.ended) {
      return new Date(content.ended).getFullYear();
    }
    return null;
  };

  const endedYear = getEnded();

  const getGenre = () => {
    if ('genre' in content) {
      if (Array.isArray(content.genre)) {
        return content.genre.join(', ');
      }
      if (typeof content.genre === 'string') {
        return content.genre;
      }
    }

    return [];
  };

  const formatedGenres = getGenre();

  const getPlatforms = () => {
    if ('platforms' in content) {
      if (Array.isArray(content.platforms)) {
        return content.platforms.join(', ');
      }
      if (typeof content.platforms === 'string') {
        return content.platforms;
      }
    }
    return [];
  };

  const formatedPlatforms = getPlatforms();

  return (
    <View className="mb-4 gap-1">
      <View>
        <AppText className="text-3xl font-bold" style={{ color: colors.primaryText }}>
          {content.title || t('common.noTitle')}
        </AppText>
        {autor && (
          <AppText className="text-base" style={{ color: colors.secondaryText }}>
            {autor}
          </AppText>
        )}
      </View>

      <View className="flex-row flex-wrap items-center gap-2 pt-1">
        {!!releaseYear && (
          <View
            className="justify-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: colors.surfaceButton }}>
            <AppText className="text-sm font-semibold" style={{ color: colors.markerText }}>
              {endedYear ? `${releaseYear} - ${endedYear}` : releaseYear}
            </AppText>
          </View>
        )}

        {!!formatedGenres && formatedGenres.length > 0 && (
          <View
            className="flex-shrink rounded-lg px-3 py-1.5"
            style={{ backgroundColor: colors.surfaceButton }}>
            <AppText className="text-sm" numberOfLines={1} style={{ color: colors.markerText }}>
              {formatedGenres}
            </AppText>
          </View>
        )}

        {!!formatedPlatforms && formatedPlatforms.length > 0 && (
          <View
            className="rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.accent}1A` }}>
            <AppText className="text-sm" style={{ color: colors.accent }}>
              {formatedPlatforms}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

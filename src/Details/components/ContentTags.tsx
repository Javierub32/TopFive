import { View, Text } from 'react-native';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { useTheme } from 'context/ThemeContext';
import { RatingIcon } from 'components/Icons';

interface Props {
  content: Book | Film | Series | Song | Game;
}

export const ContentTags = ({ content }: Props) => {
  const { colors } = useTheme();

  const releaseYear = content.releaseDate ? new Date(content.releaseDate).getFullYear() : 'N/A';

  const newRating = () => {
    if ('rating' in content) {
      return content.rating;
    }

    return null;
  };

  const formatedRating = newRating();

  const newGenre = () => {
    if ('genre' in content) {
        if (Array.isArray(content.genre) ) {
            return content.genre.join(', ')
        }
        if (typeof content.genre === 'string') {
            return content.genre
        }
    }

    return [];
  };

  const formatedGenres = newGenre();

  return (
    <View className="mb-4">
      <Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>
        {content.title || 'Sin título'}
      </Text>

      <View className="mb-4 flex-row flex-wrap items-stretch gap-2">
        <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: colors.surfaceButton }}>
          <Text className="text-sm font-semibold" style={{ color: colors.markerText }}>
            {releaseYear}
          </Text>
        </View>

        {!!newRating && (
          <View
            className="flex-row items-center rounded-lg border px-3 py-1.5"
            style={{ backgroundColor: colors.surfaceButton, borderColor: colors.rating }}>
            <RatingIcon />
            <Text className="ml-1 text-sm font-bold" style={{ color: colors.markerText }}>
              {formatedRating}
            </Text>
          </View>
        )}

        {formatedGenres && (
          <View
            className="rounded-lg px-3 py-1.5"
            style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
            <Text className="text-sm" numberOfLines={1} style={{ color: colors.markerText }}>
              {formatedGenres}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

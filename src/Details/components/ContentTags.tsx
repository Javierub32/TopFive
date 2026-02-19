import { View, Text } from 'react-native';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { useTheme } from 'context/ThemeContext';
import { RatingIcon, RatingStarIcon } from 'components/Icons';
import { ResourceType } from "hooks/useResource";

interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
}

export const ContentTags = ({ content, type }: Props) => {
  const { colors } = useTheme();

  const releaseYear = content.releaseDate ? new Date(content.releaseDate).getFullYear() : 'N/A';

  const getEnded = () => {
    if ('ended' in content && content.ended) {
      return new Date(content.ended).getFullYear();
    }
    return null;
  }

  const endedYear = getEnded();

  const ResourceMap : Record<ResourceType, string> = {
    pelicula: 'film',
    serie: 'series',
    videojuego: 'games',
    libro: 'book',
    cancion: 'song'
  }; 

  const typeContent = ResourceMap[type];

  const newRating = () => {
    if ('rating' in content) {
      if (!content.rating) return null;
      if (typeContent == 'film' || typeContent == 'series') {
        return (content.rating/2).toFixed(1);
      }
      if(typeContent == 'games'){
        return (content.rating/20).toFixed(1);
      }
      return content.rating;
    }

    return null;
  };

  const formatedRating = newRating();

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
        return content.platforms
      }
    }
    return [];
  }

  const formatedPlatforms = getPlatforms();



  return (
    <View className="mb-4">
      <View className="">
        <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
          {content.title || 'Sin título'}
        </Text>
      </View>

      <View className="flex-row flex-wrap items-center gap-2 pt-1">
        {!!releaseYear && (
          <View
          className="justify-center rounded-lg px-3 py-1.5"
          style={{ backgroundColor: colors.surfaceButton }}>
            <Text className="text-sm font-semibold" style={{ color: colors.markerText }}>
              {endedYear ? `${releaseYear} - ${endedYear}` : releaseYear}
            </Text>
          </View>
        )}
        
        {!!formatedRating && (
          <View
            className="flex-row items-center rounded-lg px-3 py-1.5"
            style={{ backgroundColor: `${colors.rating}1A` }}>
            <RatingStarIcon />
            <Text className="ml-1 text-sm font-bold" style={{ color: colors.markerText }}>
              {formatedRating}
            </Text>
          </View>
        )}

        {!!formatedGenres && formatedGenres.length > 0 && (
          <View
            className="rounded-lg px-3 py-1.5"
            style={{ backgroundColor: colors.surfaceButton}}>
            <Text className="text-sm" numberOfLines={1} style={{ color: colors.markerText }}>
              {formatedGenres}
            </Text>
          </View>
        )}

        {!!formatedPlatforms && formatedPlatforms.length > 0 && (
          <View 
            className="rounded-lg px-3 py-1.5" 
            style={{ backgroundColor: `${colors.accent}1A` }}>
            <Text className="text-sm" style={{ color: colors.accent }}>
              {formatedPlatforms}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

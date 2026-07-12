import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ScalableRatingIcon, ScalableFontAwesome5 } from 'components/Icons';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { ResourceType } from 'hooks/useResource';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Props {
  content: Book | Film | Series | Song | Game;
  type: ResourceType;
}

export const ContentRating = ({ content, type }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const newRating = () => {
    if ('rating' in content) {
      return content.rating;
    }

    return null;
  };

  const rating = newRating();

  const roundRating = () => {
    if (rating) {
      return Math.round(rating * 2) / 2;
    }
    return null;
  };

  const starsRating = roundRating();

  return (
    <>
      {rating && starsRating && (
        <View
          className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
          style={{ backgroundColor: `${colors.rating}1A` }}>
          <View className="flex-row items-center gap-2">
            <ScalableRatingIcon />
            <AppText
              className="font-bold uppercase tracking-widest"
              style={{ color: colors.markerText, fontSize: 12 }}>
              {t('details.generalRating')}
            </AppText>
          </View>
          <View className="flex-row items-center justify-center gap-6">
            <View className="flex-row items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => {
                let iconName = 'star';
                let isSolid = true;
                let iconColor = colors.rating;

                if (starsRating >= star) {
                  iconName = 'star';
                  isSolid = true;
                } else if (starsRating >= star - 0.5) {
                  iconName = 'star-half-alt';
                  isSolid = true;
                } else {
                  iconName = 'star';
                  isSolid = false;
                  iconColor = colors.markerText;
                }

                return (
                  <ScalableFontAwesome5
                    key={star}
                    name={iconName}
                    size={20}
                    color={iconColor}
                    solid={isSolid}
                    style={{ marginRight: 4 }}
                  />
                );
              })}
            </View>
            <AppText className="text-lg font-semibold" style={{ color: colors.secondaryText, fontSize: 14 }}>
              {rating}
            </AppText>
          </View>
        </View>
      )}
    </>
  );
};

import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { RatingIcon, FontAwesome5 } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Props {
  rating: number;
}

export const RatingCard = ({ rating }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
      style={{ backgroundColor: `${colors.rating}1A` }}>
      <View className="flex-row items-center gap-2">
        <RatingIcon />
        <AppText
          className="font-bold uppercase tracking-widest"
          style={{ color: colors.markerText, fontSize: 14 }}>
          {t('details.rating')}
        </AppText>
      </View>
      <View className="flex-1 flex-row items-center justify-center">
        {[1, 2, 3, 4, 5].map((star) => {
          let iconName = 'star';
          let isSolid = true;
          let iconColor = colors.rating;

          if (rating >= star) {
            iconName = 'star';
            isSolid = true;
          } else if (rating >= star - 0.5) {
            iconName = 'star-half-alt'; // Muestra la media estrella
            isSolid = true;
          } else {
            iconName = 'star';
            isSolid = false;
            iconColor = colors.markerText;
          }

          return (
            <FontAwesome5
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
    </View>
  );
};

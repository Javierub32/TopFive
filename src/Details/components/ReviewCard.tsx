import { TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ScalableReviewIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import RenderHtml from 'react-native-render-html';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

interface Props {
  review: string;
  username?: string;
  avatarUrl?: string | null;
}

export const ReviewCard = ({ review, username, avatarUrl }: Props) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const tagsStyles = {
    body: {
      color: colors.primaryText,
      fontStyle: 'italic',
      lineHeight: 24,
      fontSize: 15,
    },
    p: {
      margin: 0,
    },
    b: { fontWeight: 'bold' },
    i: { fontStyle: 'italic' },
    ul: { marginVertical: 4 },
    ol: { marginVertical: 4 },
  };

  const handleUserPress = () => {
    if (username) {
      router.push({
        pathname: 'details/user/',
        params: { username, from: 'details' },
      });
    }
  };

  return (
    <View
      className="flex flex-1 justify-between gap-2 rounded-2xl border-l-4 p-4"
      style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
      
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <ScalableReviewIcon />
          <AppText
            className="font-bold uppercase tracking-widest"
            style={{ color: colors.markerText, fontSize: 14 }}>
            {t('details.review')}
          </AppText>
        </View>

        {username && (
          <TouchableOpacity
            className="flex-row items-center gap-2"
            activeOpacity={0.7}
            onPress={handleUserPress}>
            <AppText
              className="font-semibold"
              style={{ color: colors.secondaryText, fontSize: 12 }}>
              {username}
            </AppText>

            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="h-6 w-6 rounded-full"
                style={{ borderWidth: 0 }}
              />
            ) : (
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary }}>
                <AppText
                  className="font-bold"
                  style={{ color: colors.primaryText, fontSize: 10 }}>
                  {username.charAt(0).toUpperCase()}
                </AppText>
              </View>
            )}
            
          </TouchableOpacity>
        )}
      </View>

      {/* Si hay texto, renderizamos el HTML. Si está vacío, mostramos el guion por defecto */}
      {review ? (
        <RenderHtml
          // Calculamos el ancho: pantalla total menos el padding de la vista padre
          contentWidth={width - 64}
          source={{ html: review }}
          tagsStyles={tagsStyles as any}
        />
      ) : (
        <AppText className="italic leading-relaxed" style={{ color: colors.primaryText, fontSize: 14 }}>
          -
        </AppText>
      )}
    </View>
  );
};

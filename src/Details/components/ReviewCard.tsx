import { View, useWindowDimensions } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ReviewIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import RenderHtml from 'react-native-render-html';
import { useTranslation } from 'react-i18next';

interface Props {
  review: string;
}

export const ReviewCard = ({ review }: Props) => {
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

  return (
    <View
      className="flex flex-1 justify-between gap-2 rounded-2xl border-l-4 p-4"
      style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
      <View className="flex-row items-center gap-2">
        <ReviewIcon />
        <AppText
          className="font-bold uppercase tracking-widest"
          style={{ color: colors.markerText, fontSize: 14 }}>
          {t('details.review')}
        </AppText>
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

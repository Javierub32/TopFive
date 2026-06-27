import { useRef } from 'react';
import { useTheme } from 'context/ThemeContext';
import { View, Platform } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useTranslation } from 'react-i18next';

interface Props {
  review: any;
  setReview: any;
}

export const ReviewSetter = ({ review, setReview }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const richText = useRef<RichEditor>(null);

  // esto para no contar los tipos de letras (negrita y tal) como caracteres
  const plainTextLength = (review || '')
    .replace(/<[^>]*>?/gm, '') // Quita todas las etiquetas HTML
    .replace(/&nbsp;/g, ' ').length; // Convierte los espacios HTML en espacios reales

  return (
    <View
      className="relative flex-1 overflow-hidden rounded-xl"
      style={{
        backgroundColor: colors.surfaceButton,
        minHeight: Platform.OS === 'web' ? 120 : 180, // En web no necesitamos tanto alto porque no hay barra
      }}>
      {Platform.OS === 'web' ? (
        // NAVEGADOR
        <AppTextInput
          value={review}
          onChangeText={setReview}
          placeholder="[Modo Web] Escribe tu opinión..."
          placeholderTextColor={colors.placeholderText}
          multiline
          numberOfLines={3}
          maxLength={1000}
          className="flex-1 p-3 text-base"
          style={{ color: colors.primaryText, fontSize: 14 }}
          textAlignVertical="top"
        />
      ) : (
        //IOS / ANDROID
        <>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
            ]}
            iconTint={colors.primaryText}
            selectedIconTint={colors.primary}
            style={{
              backgroundColor: colors.surfaceButton,
              borderBottomWidth: 1,
              borderBottomColor: colors.background,
            }}
          />
          <RichEditor
            ref={richText}
            initialContentHTML={review}
            onChange={setReview}
            placeholder={t('forms.reviewPlaceholder')}
            editorStyle={{
              backgroundColor: colors.surfaceButton,
              color: colors.primaryText,
              placeholderColor: colors.placeholderText,
            }}
            style={{ flex: 1, marginBottom: 12 }}
          />
        </>
      )}

      {/* El contador de caracteres es igual para ambos */}
      <AppText
        className="absolute bottom-0 right-0 m-2 text-right text-xs"
        style={{ color: plainTextLength > 1000 ? 'red' : colors.placeholderText, fontSize: 14 }}>
        {plainTextLength}/1000
      </AppText>
    </View>
  );
};

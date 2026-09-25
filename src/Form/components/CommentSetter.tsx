import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
import { SendIcon } from 'components/Icons';

const MAX_LENGTH = 250;

interface Props {
  comment: string;
  setComment: (comment: string) => void;
  onSend?: (comment: string) => void | Promise<void>;
  sending?: boolean;
}

export const CommentSetter = ({ comment, setComment, onSend, sending = false }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const trimmedComment = comment.trim();
  const canSend = trimmedComment.length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      await onSend?.(trimmedComment);
      setComment('');
    } catch (error) {
      // Mantenemos el texto para que el usuario pueda reintentar
      console.error('Error sending comment:', error);
    }
  };

  return (
    <View className="mt-2">
      <View
        className="flex-row items-end overflow-hidden rounded-xl p-2"
        style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-1">
          <AppTextInput
            maxLength={MAX_LENGTH}
            placeholder={t('forms.commentPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            value={comment}
            onChangeText={setComment}
            multiline
            className="p-2 text-base"
            style={{ color: colors.primaryText, fontSize: 14 }}
            textAlignVertical="top"
          />
          <AppText
            className="mr-1 text-right text-xs"
            style={{ color: colors.placeholderText, fontSize: 12 }}>
            {comment.length}/{MAX_LENGTH}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
          className="mb-1 ml-2 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary, opacity: canSend ? 1 : 0.2 }}>
          <SendIcon size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

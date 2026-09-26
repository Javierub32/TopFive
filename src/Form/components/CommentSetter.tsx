import { useTheme } from 'context/ThemeContext';
import { Keyboard, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
import { SendIcon } from 'components/Icons';
import { RefObject, useEffect, useRef } from 'react';

const MAX_LENGTH = 250;
const KEYBOARD_MARGIN = 30;

type ScrollViewWithInnerRef = ScrollView & { getInnerViewRef(): View | null };

interface Props {
  comment: string;
  setComment: (comment: string) => void;
  onSend?: (comment: string) => void | Promise<void>;
  sending?: boolean;
  autoFocus?: boolean;
  scrollRef?: RefObject<ScrollView | null>;
}

export const CommentSetter = ({ comment, setComment, onSend, sending = false, autoFocus = false, scrollRef }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);

  const scrollAboveKeyboard = (keyboardTop: number) => {
    const scrollView = scrollRef?.current;
    const nativeScroll = scrollView?.getNativeScrollRef();
    const content = (scrollView as ScrollViewWithInnerRef | null | undefined)?.getInnerViewRef();
    if (!scrollView || !nativeScroll || !content || !containerRef.current) return;

    nativeScroll.measureInWindow((_x, svTop, _w, svHeight) => {
      const visibleHeight = Math.min(svTop + svHeight, keyboardTop) - svTop;
      containerRef.current?.measureLayout(content, (_cx, cy, _cw, ch) => {
        scrollView.scrollTo({ y: Math.max(0, cy + ch + KEYBOARD_MARGIN - visibleHeight), animated: true });
      });
    });
  };

  const scrollIfKeyboardVisible = () => {
    const metrics = Keyboard.metrics();
    if (inputRef.current?.isFocused() && Keyboard.isVisible() && metrics) {
      scrollAboveKeyboard(metrics.screenY);
    }
  };

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', (e) => {
      if (inputRef.current?.isFocused()) scrollAboveKeyboard(e.endCoordinates.screenY);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

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
    <View ref={containerRef} className="mt-2">
      <View
        className="flex-row items-end overflow-hidden rounded-xl p-2"
        style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-1">
          <AppTextInput
            ref={inputRef}
            onFocus={scrollIfKeyboardVisible}
            onContentSizeChange={scrollIfKeyboardVisible}
            maxLength={MAX_LENGTH}
            placeholder={t('login.forms.commentPlaceholder')}
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

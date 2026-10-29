import { GestureResponderEvent, Image, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from 'context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { Comment } from '../services/commentServices';
import { useNotification } from 'context/NotificationContext';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

interface Props {
  comment: Comment;
  onDelete?: (commentId: number) => Promise<void>;
  onBlock?: (userId: string) => Promise<void>;
}

export const CommentItem = ({ comment, onDelete, onBlock }: Props) => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { showNotification, hideNotification } = useNotification();

  const username = comment.author?.username ?? '';
  const avatarUrl = comment.author?.avatar_url;

  const formattedDate = new Date(comment.created_at).toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleUserPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (username) {
      router.push({
        pathname: 'details/user/',
        params: { username, from: 'details' },
      });
    }
  };

  const handleCommentLongPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (!onDelete && !onBlock) return;
    impactAsync(ImpactFeedbackStyle.Medium);

    if (onBlock) {
      showNotification({
        title: t('profile.blockUser.title', { username }),
        description: t('profile.blockUser.description', { username }),
        isChoice: true,
        delete: true,
        success: false,
        leftButtonText: t('common.cancel'),
        rightButtonText: t('profile.blockUser.action'),
        highlightRight: true,
        onLeftPress: () => hideNotification(),
        onRightPress: async () => {
          hideNotification();
          try {
            await onBlock(comment.user_id);
            showNotification({
              title: t('profile.blockUser.successTitle'),
              description: t('profile.blockUser.successDescription', { username }),
              isChoice: false,
              delete: false,
              success: true,
            });
          } catch {
            showNotification({
              title: t('common.error'),
              description: t('profile.blockUser.errorDescription', { username }),
              isChoice: false,
              delete: false,
              success: false,
            });
          }
        },
      });
      return;
    }

    if (!onDelete) return;

    showNotification({
      title: t('forms.deleteComment.title'),
      description: t('forms.deleteComment.description'),
      isChoice: true,
      delete: true,
      success: false,
      leftButtonText: t('common.cancel'),
      rightButtonText: t('common.delete'),
      highlightRight: true,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();
        try {
          await onDelete(comment.id);
          showNotification({
            title: t('forms.deleteComment.successTitle'),
            description: t('forms.deleteComment.resourceDeletedDescription'),
            isChoice: false,
            delete: false,
            success: true,
          });
        } catch {
          showNotification({
            title: t('common.error'),
            description: t('forms.deleteComment.failedToDelete'),
            isChoice: false,
            delete: false,
            success: false,
          });
        }
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={onDelete || onBlock ? 0.7 : 1}
      className="flex-row gap-3 rounded-2xl p-3"
      style={{ backgroundColor: colors.surfaceButton }}
      onLongPress={onDelete || onBlock ? handleCommentLongPress : undefined}>
      <TouchableOpacity activeOpacity={0.7} onPress={handleUserPress}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="h-9 w-9 rounded-full" />
        ) : (
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary }}>
            <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
              {username.charAt(0).toUpperCase()}
            </AppText>
          </View>
        )}
      </TouchableOpacity>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity activeOpacity={0.7} onPress={handleUserPress}>
            <AppText className="font-semibold" style={{ color: colors.primaryText, fontSize: 14 }}>
              {username}
            </AppText>
          </TouchableOpacity>
          <AppText style={{ color: colors.placeholderText, fontSize: 12 }}>{formattedDate}</AppText>
        </View>
        <AppText style={{ color: colors.secondaryText, fontSize: 14 }}>{comment.content}</AppText>
      </View>
    </TouchableOpacity>
  );
};

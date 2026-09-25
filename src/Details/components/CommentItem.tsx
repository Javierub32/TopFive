import { Image, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from 'context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { Comment } from '../services/commentServices';

interface Props {
  comment: Comment;
}

export const CommentItem = ({ comment }: Props) => {
  const { colors } = useTheme();
  const { i18n } = useTranslation();

  const username = comment.author?.username ?? '';
  const avatarUrl = comment.author?.avatar_url;

  const formattedDate = new Date(comment.created_at).toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleUserPress = () => {
    if (username) {
      router.push({
        pathname: 'details/user/',
        params: { username, from: 'details' },
      });
    }
  };

  return (
    <View className="flex-row gap-3 rounded-xl p-3" style={{ backgroundColor: colors.surfaceButton }}>
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
    </View>
  );
};

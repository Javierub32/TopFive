import { ScalableFavoriteIcon, ScalableNonFavoriteIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity, View } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from 'components/AppText';

interface Props {
  liked: boolean;
  setLiked: (liked: boolean) => void;
  likeCount?: number;
  size?: number;
  disabled?: boolean;
  onLongPress?: () => void;
}

export const LikeSetter = ({
  liked,
  setLiked,
  likeCount,
  size = 24,
  disabled = false,
  onLongPress,
}: Props) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const showCount = typeof likeCount === 'number';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    impactAsync(ImpactFeedbackStyle.Light);

    setLiked(!liked);

    scale.value = withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  };

  return (
    <View
      className={`flex-row items-center gap-1 rounded-full ${showCount ? 'pl-4 pr-2' : ''}`}
      style={showCount ? { backgroundColor: `${colors.favorite}${liked ? 3 : 1}A` } : undefined}>
      {showCount && (
        <AppText style={{ color: colors.primaryText, fontSize: 18 }}>{likeCount}</AppText>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onLongPress={onLongPress}
        disabled={disabled}
        className="items-center p-2">
        <Animated.View style={animatedStyle}>
          {liked ? (
            <ScalableFavoriteIcon size={size} />
          ) : (
            <ScalableNonFavoriteIcon size={size} color={colors.primaryText} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

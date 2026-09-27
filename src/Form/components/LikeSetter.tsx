import { ScalableFavoriteIcon, ScalableNonFavoriteIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

interface Props {
    liked: boolean;
    setLiked: (liked: boolean) => void;
    size?: number;
}

export const LikeSetter = ({liked, setLiked, size = 24} : Props) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        setLiked(!liked);
        scale.value = withSequence(
          withTiming(1.5, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
    }

    return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="items-center p-2">
      <Animated.View style={animatedStyle}>
        {liked ? (
          <ScalableFavoriteIcon size={size}/>
        ) : (
          <ScalableNonFavoriteIcon size={size} color={colors.primaryText} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
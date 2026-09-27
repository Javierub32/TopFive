import { ScalableFavoriteIcon, ScalableNonFavoriteIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

interface Props {
    favorite: any;
    setFavorite: any;
}

export const FavoriteSetter = ({favorite, setFavorite} : Props) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        setFavorite(!favorite);
        scale.value = withSequence(
          withTiming(1.5, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
    }

    return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="items-center rounded-full p-2"
      style={{ backgroundColor: `${colors.favorite}1A` }}>
      <Animated.View style={animatedStyle}>
        {favorite ? (
          <ScalableFavoriteIcon size={24} />
        ) : (
          <ScalableNonFavoriteIcon size={24} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
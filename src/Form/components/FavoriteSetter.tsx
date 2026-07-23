import { ScalableFavoriteIcon, ScalableNonFavoriteIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
    favorite: any;
    setFavorite: any;
}

export const FavoriteSetter = ({favorite, setFavorite} : Props) => {
    const { colors } = useTheme();
    const [isAnimate, setIsAnimate] = useState(false);

    const handlePress = () => {
        setFavorite(!favorite);
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 200);
    }

    return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="items-center rounded-full p-2"
      style={{ backgroundColor: `${colors.favorite}1A` }}>
      <View
        className={`transition-all duration-200 ease-out ${
          isAnimate ? 'scale-150' : 'scale-100'
        }`}>
        {favorite ? (
          <ScalableFavoriteIcon size={24} />
        ) : (
          <ScalableNonFavoriteIcon size={24} />
        )}
      </View>
    </TouchableOpacity>
  );
};
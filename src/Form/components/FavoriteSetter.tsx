import { ScalableFavoriteIcon, ScalableNonFavoriteIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { TouchableOpacity } from "react-native";

interface Props {
    favorite: any;
    setFavorite: any;
}

export const FavoriteSetter = ({favorite, setFavorite} : Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={() => setFavorite(!favorite)} className="p-2 rounded-full items-center" style={{backgroundColor: `${colors.favorite}1A`}}>
            {favorite && (
                <ScalableFavoriteIcon size={24}/>
            )}
            {!favorite && (
                <ScalableNonFavoriteIcon size={24}/>
            )}
        </TouchableOpacity>
    )

}
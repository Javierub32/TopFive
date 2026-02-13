import { FavoriteIcon, NonFavoriteIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { TouchableOpacity } from "react-native";

interface Props {
    resource: any
}

export const FavoriteSetter = ({resource} : Props) => {
    const { colors } = useTheme();
    const [ favorito, setFavorito] = useState(resource?.favorito || false);

    return (
        <TouchableOpacity onPress={() => setFavorito(!favorito)} className="p-2 rounded-full items-center" style={{backgroundColor: `${colors.favorite}1A`}}>
            {favorito && (
                <FavoriteIcon size={24}/>
            )}
            {!favorito && (
                <NonFavoriteIcon size={24}/>
            )}
        </TouchableOpacity>
    )

}
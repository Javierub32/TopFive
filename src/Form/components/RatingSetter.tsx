import { RatingStarIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { useState } from "react";
import { Touchable, TouchableOpacity, View } from "react-native";

interface Props {
    resource: any;
}

export const RatingSetter = ({resource}: Props) => {
    const { colors } = useTheme();
    const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);

    return ( 
        <View className="flex-row justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((star)=> ( 
                <TouchableOpacity key={star} onPress={() => {calificacionPersonal != star ? setCalificacionPersonal(star) : setCalificacionPersonal(star-1)}}>
                    <RatingStarIcon size={32} color={star <= calificacionPersonal ? colors.rating : colors.placeholderText} solid={star <= calificacionPersonal}/>
                </TouchableOpacity>
            ))}
        </View>
    )

}
import { RatingStarIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { useState } from "react";
import { Touchable, TouchableOpacity, View } from "react-native";

interface Props {
    rating: any;
    setRating: any;
}

export const RatingSetter = ({rating, setRating}: Props) => {
    const { colors } = useTheme();

    return ( 
        <View className="flex-row justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((star)=> ( 
                <TouchableOpacity key={star} onPress={() => {rating != star ? setRating(star) : setRating(star-1)}}>
                    <RatingStarIcon size={32} color={star <= rating ? colors.rating : colors.placeholderText} solid={star <= rating}/>
                </TouchableOpacity>
            ))}
        </View>
    )

}
import { FontAwesome5 } from "@expo/vector-icons";
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

    const handlePress = (star: number) => {
        if (rating === star) {
            setRating(star - 0.5);
        } else if (rating === star - 0.5) {
            setRating(star - 1);
        } else {
            setRating(star)
        }
    }

    return ( 
        <View className="flex-row justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((star)=> {
                let iconName = "star";
                let isSolid = true;
                let iconColor = colors.rating;

                if (rating>=star) {
                    iconName = "star";
                    isSolid = true;
                } else if (rating === star - 0.5){
                    iconName = "star-half-alt";
                    isSolid=true;
                } else {
                    iconName = "star";
                    isSolid = false;
                    iconColor = colors.placeholderText;
                }

                return(
                    <TouchableOpacity key={star} onPress={() => handlePress(star)} activeOpacity={0.7}>
                        <FontAwesome5 name={iconName} size={32} color={iconColor} solid={isSolid}/>
                    </TouchableOpacity>
                );
            })}
                
        </View>
    )

}
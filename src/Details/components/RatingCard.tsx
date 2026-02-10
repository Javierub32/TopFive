import { View, Text } from "react-native";
import { useTheme } from "context/ThemeContext";
import { RatingIcon } from "components/Icons";
import { FontAwesome5 } from "@expo/vector-icons";


interface Props {
    rating: number;
}

export const RatingCard =({rating}: Props) => {
    const {colors} = useTheme();

    return(
         <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.rating}1A`}}>
            <View className='flex-row items-center gap-2'>
                <RatingIcon/>
                <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Calificación</Text>
            </View>
            <View className="flex-1 flex-row justify-center items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome5
                    key={star}
                    name="star"
                    size={20}
                    color={star <= rating ? colors.rating : colors.markerText}
                    solid={star <= rating}
                    style={{ marginRight: 4 }}
                />
                ))}
            </View>
        </View>
    )
}
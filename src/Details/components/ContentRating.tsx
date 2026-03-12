import { View, Text } from "react-native";
import { useTheme } from "context/ThemeContext";
import { RatingIcon } from "components/Icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Book, Film, Game, Series, Song } from "app/types/Content";
import { ResourceType } from "hooks/useResource";


interface Props {
    content: Book | Film | Series | Song | Game;
    type: ResourceType;
}

export const ContentRating =({content, type}: Props) => {
    const {colors} = useTheme();

    const ResourceMap : Record<ResourceType, string> = {
        pelicula: 'film',
        serie: 'series',
        videojuego: 'games',
        libro: 'book',
        cancion: 'song'
    }; 

    const typeContent = ResourceMap[type];

    const newRating = () => {
        if ('rating' in content) {
            return content.rating
        }

        return null;
    };

    const rating = newRating();

    const roundRating = () => {
        if(rating) {
            return (Math.round(rating * 2) / 2)
        }
        return null;
    }

    const starsRating = roundRating();

    return(
        <>
            {rating && starsRating && (
            <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.rating}1A`}}>
                <View className='flex-row items-center gap-2'>
                    <RatingIcon/>
                    <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Calificación general</Text>
                </View>
                <View className="flex-row justify-center gap-6 items-center">
                    <View className="flex-row justify-center items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                            let iconName = "star";
                            let isSolid = true;
                            let iconColor = colors.rating;

                            if (starsRating >= star) {
                                iconName = "star";
                                isSolid = true;
                            } else if (starsRating >= star - 0.5) {
                                iconName = "star-half-alt";
                                isSolid = true;
                            } else {
                                iconName = "star";
                                isSolid = false;
                                iconColor = colors.markerText;
                            }

                            return (
                                <FontAwesome5
                                    key={star}
                                    name={iconName}
                                    size={20}
                                    color={iconColor}
                                    solid={isSolid}
                                    style={{ marginRight: 4 }}
                                />
                            );
                        })}
                    </View>
                    <Text className="text-lg font-semibold" style={{color: colors.secondaryText}}>
                        {rating}
                    </Text>
                </View>
                
            </View>
            )}
        </>
    )
}
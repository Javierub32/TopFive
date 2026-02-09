import { View, Text } from "react-native"
import { useTheme } from "context/ThemeContext"
import { ReviewIcon } from "components/Icons";


interface Props {
    review: string
}

export const ReviewCard = ({review} : Props) => {

    const { colors } = useTheme();

    return (
        <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2 border-l-4' style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton}}>
            <View className='flex-row items-center gap-2'>
            <ReviewIcon/>
            <Text className='text-sm font-bold uppercase tracking-widest' style={{ color: colors.markerText}}>Reseña</Text>
            </View>
            <Text className='leading-relaxed italic' style={{color: colors.primaryText}}>
            {review || '-'}
            </Text>
        </View>
    )
}
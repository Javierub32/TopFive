import { useTheme } from "context/ThemeContext"
import { TextInput, Text, View } from "react-native"

interface Props {
    review: any;
    setReview: any;
}

export const ReviewSetter = ({review, setReview} : Props) => {
    const { colors } = useTheme();

    return (
        <View className="relative flex-1 min-h-24 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
            <TextInput value={review}
            onChangeText={setReview}
            placeholder="Escribe tu opinión..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={3}
            maxLength={500}
            className="min-h-24 p-3 text-base"
            style={{color: colors.primaryText}}
            textAlignVertical="top"/>
            <Text className="absolute bottom-0 right-0 text-right text-xs m-2" style={{color: colors.placeholderText}}>{review.length}/500</Text>
        </View>
    )
}
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { TextInput, Text, View } from "react-native"

interface Props {
    resource: any;
}

export const ReviewSetter = ({resource} : Props) => {
    const { colors } = useTheme();
    const [reseña, setReseña] = useState(resource?.reseña || '');
    return (
        <View className="flex-1">
            <TextInput value={reseña}
            onChangeText={setReseña}
            placeholder="Escribe tu opinión..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={3}
            maxLength={500}
            className="min-h-24 rounded-lg p-3 text-base"
            style={{backgroundColor: colors.surfaceButton, color: colors.primaryText}}
            textAlignVertical="top"/>
            <Text className="mt-1 text-right text-xs" style={{color: colors.secondaryText}}>{reseña.length}/500</Text>
        </View>
    )
}
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { TextInput, Text, View } from "react-native"

interface Props {
    review: any;
    setReview: any;
}

export const ReviewSetter = ({review, setReview} : Props) => {
    const { colors } = useTheme();

    return (
        <View className="flex-1">
            <TextInput value={review}
            onChangeText={setReview}
            placeholder="Escribe tu opinión..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={3}
            maxLength={500}
            className="min-h-24 rounded-lg p-3 text-base"
            style={{backgroundColor: colors.surfaceButton, color: colors.primaryText}}
            textAlignVertical="top"/>
            <Text className="mt-1 text-right text-xs" style={{color: colors.secondaryText}}>{review.length}/500</Text>
        </View>
    )
}
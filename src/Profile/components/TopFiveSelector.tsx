import { useTheme } from 'context/ThemeContext';
import { View, Text, Pressable } from 'react-native';


export const TopFiveSelector = () => {
    const slots = Array.from({ length: 5 });
    const { colors } = useTheme();

    return (
        <View className="mb-4">
            <Text className="font-bold text-lg mb-2" style={{ color: colors.primaryText }}>Mi Top 5</Text>
            <View className="flex-row gap-2">
                {slots.map((_, index) => (
                    <View key={index} className="flex-1 rounded-lg" style={{ backgroundColor: colors.surfaceButton }}>
                        <Pressable>
                            <View className="w-full aspect-[2/3] rounded-lg items-center justify-center border" style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
                                <Text className="text-xl" style={{ color: colors.secondaryText }}>+</Text>
                            </View>
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    );
}
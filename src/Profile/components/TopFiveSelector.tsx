import { View, Text, Pressable } from 'react-native';


export const TopFiveSelector = () => {
    const slots = Array.from({ length: 5 });

    return (
        <View className="mb-4">
            <Text className="text-primaryText font-bold text-lg mb-2">Mi Top 5</Text>
            <View className="flex-row gap-2">
                {slots.map((_, index) => (
                    <View key={index} className="flex-1 bg-card rounded-lg">
                        <Pressable>
                            <View className="w-full aspect-[2/3] bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                                <Text className="text-secondaryText text-xl">+</Text>
                            </View>
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    );
}
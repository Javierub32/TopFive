import { View, Text, Pressable } from 'react-native';


export const TopFiveSelector = () => {
    return (
    <View className="mb-4">
        {/* Aquí iría la lógica y componentes para seleccionar el Top 5 */}

        <View className="flex-row justify-between">
            <View className="bg-card rounded-lg">
                <Pressable>
                    <View className="h-28 w-20 bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                        <Text className="text-secondaryText">+</Text>
                    </View>
                </Pressable>
            </View>
            <View className="bg-card rounded-lg">
                <Pressable>
                    <View className="h-28 w-20 bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                        <Text className="text-secondaryText">+</Text>
                    </View>
                </Pressable>
            </View>
            <View className="bg-card rounded-lg">
                <Pressable>
                    <View className="h-28 w-20 bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                        <Text className="text-secondaryText">+</Text>
                    </View>
                </Pressable>
            </View>
            <View className="bg-card rounded-lg">
                <Pressable>
                    <View className="h-28 w-20 bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                        <Text className="text-secondaryText">+</Text>
                    </View>
                </Pressable>
            </View>
            <View className="bg-card rounded-lg">
                <Pressable>
                    <View className="h-28 w-20 bg-surfaceButton rounded-lg items-center justify-center border border-borderButton">
                        <Text className="text-secondaryText">+</Text>
                    </View>
                </Pressable>
            </View>
        </View>

    </View>
    );
}
import { ReturnButton } from "components/ReturnButton";
import { Pressable, View, Text, TextComponent} from "react-native";
import { Screen } from 'components/Screen';
import { Ionicons } from "@expo/vector-icons";

import { useProfile } from 'src/Profile/hooks/useProfile';

export default function SettingsScreen() {

    const {
    user,
    userData,
    selectedCategory,
    isPressed,
    categoryData,
    setSelectedCategory,
    setIsPressed,
    pickImage,
    signOut,
    selectedYear,
    setSelectedYear,
	showNotifications,
    showSettings,
  } = useProfile();


    return (
        <Screen>
            <ReturnButton route='/(tabs)/Profile' title='Configuración' />
            <View className="flex-1 p-4">
                <Text className="text-lg text-secondaryText">Settings content goes here</Text>
                <View className="">
                    <Pressable
                        className="flex-row justify-between items-center rounded border-2 border-error bg-error/10 p-3"
                        onPress={signOut}>
                        <Text className="text-lg text-primaryText">Cerrar sesión</Text>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </Screen>
    );
}
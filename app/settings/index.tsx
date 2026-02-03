import { ReturnButton } from "components/ReturnButton";
import { Pressable, View, Text, TextComponent} from "react-native";
import { Screen } from 'components/Screen';
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons/';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";

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
  } = useProfile();

  const { colors, toggleTheme} = useTheme();


    return (
        <Screen>
            <ReturnButton route='/(tabs)/Profile' title='Configuración' />
            <View className="flex-1 p-4">
                <Text className="text-lg pb-4" style= {{color: colors.secondaryText}}>Settings content goes here</Text>
                <View className="flex-col justify-center gap-2">
                    <Pressable
                        className="w-full flex-row justify-between items-center rounded-xl border-2 p-3"
                        style={{borderColor: colors.borderButton, backgroundColor: `${colors.buttonBackground}1A`}}
                        onPress={toggleTheme}>
                        <Text className="text-lg" style={{color: colors.primaryText}}>Alternar tema</Text>
                        <FontAwesome5 name="palette" size={24} color={colors.primaryText} />
                    </Pressable>

                    <Pressable
                        className="w-full flex-row justify-between items-center rounded-xl border-2 bg-error/10 p-3"
                        style={{borderColor: colors.error, backgroundColor: `${colors.error}1A`}}
                        onPress={signOut}>
                        <Text className="text-lg" style={{color: colors.primaryText}}>Cerrar sesión</Text>
                        <Ionicons name="log-out-outline" size={24} color={colors.primaryText} />
                    </Pressable>
                </View>
                
            </View>
        </Screen>
    );
}
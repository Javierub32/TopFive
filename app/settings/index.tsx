import { ReturnButton } from "components/ReturnButton";
import { Pressable, View, Text, TextComponent} from "react-native";
import { Screen } from 'components/Screen';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons/';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";

export default function SettingsScreen() {
    const {
    signOut,
  } = useProfile();

  const { colors, toggleTheme} = useTheme();
  const { username , description } = useLocalSearchParams();


    return (
        <Screen>
            <ReturnButton route='/(tabs)/Profile' title='Configuración' />
            <View className="flex-1 p-4">
                <View className="flex-col justify-center gap-2">
					<Pressable
                        className="w-full flex-row justify-between items-center rounded-xl border-2 p-3"
                        style={{borderColor: colors.borderButton, backgroundColor: `${colors.buttonBackground}1A`}}
                        onPress={() => router.push({ pathname: '/editProfile' , params: { username, description } })}>
                        <Text className="text-lg" style={{color: colors.primaryText}}>Editar perfil</Text>
                        <AntDesign name="edit" size={20} color={colors.primaryText} />
                    </Pressable>
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
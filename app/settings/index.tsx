import { ReturnButton } from "components/ReturnButton";
import { Pressable, View, Text, TextComponent} from "react-native";
import { Screen } from 'components/Screen';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons/';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { FeedbackFormButton } from "@/Settings/components/FeedbackFormButton";

export default function SettingsScreen() {
    const {
    signOut,
  } = useProfile();

  const { colors, toggleTheme} = useTheme();
  const { username , description } = useLocalSearchParams();


    return (
        <Screen>
            <ReturnButton route='/(tabs)/Profile' title='Configuración' />
            <View className="flex-1 p-4 mb-14">
                <View className="flex-1 justify-between">
                    <View className="flex-col justify-center gap-2 rounded-2xl p-4" style={{backgroundColor: `${colors.accent}1A`}}>
                        <Text className="font-bold text-xl border-b p-1 mb-3" style={{color: colors.primaryText, borderColor: colors.secondaryText}}>
                            Personalización
                        </Text>
                        <Pressable
                            className="w-full flex-row justify-between items-center rounded-xl p-3"
                            style={{backgroundColor: `${colors.accent}33`}}
                            onPress={() => router.push({ pathname: '/editProfile' , params: { username, description } })}>
                            <Text className="text-lg" style={{color: colors.primaryText}}>Editar perfil</Text>
                            <AntDesign name="edit" size={20} color={colors.primaryText} />
                        </Pressable>
                        <Pressable
                            className="w-full flex-row justify-between items-center rounded-2xl p-3"
                            style={{backgroundColor: `${colors.accent}33`}}
                            onPress={toggleTheme}>
                            <Text className="text-lg" style={{color: colors.primaryText}}>Cambiar tema</Text>
                            <FontAwesome5 name="palette" size={24} color={colors.primaryText} />
                        </Pressable>
                    </View>
                    
					
                    <View className="flex-col justify-center gap-2">
                        

                        <FeedbackFormButton></FeedbackFormButton>

                        <Pressable
                            className="w-full flex-row justify-between items-center rounded-2xl p-3"
                            style={{backgroundColor: `${colors.error}33`}}
                            onPress={signOut}>
                            <Text className="text-lg" style={{color: colors.error}}>Cerrar sesión</Text>
                            <Ionicons name="log-out-outline" size={24} color={colors.primaryText} />
                        </Pressable>
                    </View>
                    
                    



                </View>
                
            </View>
        </Screen>
    );
}
import { ReturnButton } from "components/ReturnButton";
import { Pressable, View, Text, TextComponent, Alert} from "react-native";
import { Screen } from 'components/Screen';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons/';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { FeedbackFormButton } from "@/Settings/components/FeedbackFormButton";
import { useAuth } from "context/AuthContext";

export default function SettingsScreen() {
    const {
    signOut,
	deleteAccount,
  } = useAuth();

  const { colors, toggleTheme} = useTheme();
  const { username , description } = useLocalSearchParams();

const handleDeleteAccount = async () => {
	const confirmed = await new Promise((resolve) => {
		Alert.alert(
			'Confirmar eliminación',
			'¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
			[
				{ text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
				{ text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
			],
			{ cancelable: true }
		);
	});

	const doubleConfirmed = await new Promise((resolve) => {
		if (!confirmed) return resolve(false);
		Alert.alert(
			'Última confirmación',
			'Esta es tu última oportunidad para cancelar. ¿Realmente deseas eliminar tu cuenta?',
			[
				{ text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
				{ text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
			],
			{ cancelable: true }
		);
	});

	if (doubleConfirmed) {
		try {
			await deleteAccount();
			Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente.');
		} catch (error) {
			console.error('Error al eliminar cuenta:', error);
			Alert.alert('Error', 'Hubo un problema al eliminar tu cuenta. Intenta de nuevo más tarde.');
		}
	} 
}

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
                            onPress={handleDeleteAccount}>
                            <Text className="text-lg" style={{color: colors.error}}>Eliminar cuenta</Text>
                            <Ionicons name="trash-outline" size={24} color={colors.primaryText} />
                        </Pressable>

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
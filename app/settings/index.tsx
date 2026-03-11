import { ReturnButton } from "components/ReturnButton";
import { TouchableOpacity, View, Text, TextComponent, Alert, Linking, Platform} from "react-native";
import { Screen } from 'components/Screen';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons/';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "context/AuthContext";
import {useNotification} from "context/NotificationContext";
export default function SettingsScreen() {
    const {
    signOut,
	deleteAccount,
  } = useAuth();

  const { colors, toggleTheme} = useTheme();
  const { username , description } = useLocalSearchParams();
  const { showNotification, hideNotification } = useNotification();
const handleCloseSession = async () => {
    showNotification({
            title: 'Confirmar cierre de sesión',
            description: '¿Estás seguro de que deseas cerrar sesión?',
            leftButtonText: 'Cancelar',
            rightButtonText: 'Cerrar sesión',
            isChoice: true,
            onLeftPress: () => hideNotification(),
            onRightPress: async () => {
                try {
                    hideNotification(); // Ocultar antes de cerrar sesión
                    await signOut();
                    
                    // En web, forzar redirección explícita
                    if (Platform.OS === 'web') {
                        router.replace('/(auth)/login');
                    } else {
                        // En móvil, mostrar notificación de éxito
                        showNotification({
                            title: 'Sesión cerrada',
                            description: 'Has cerrado sesión exitosamente.',
                            isChoice: false
                        });
                    }
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    showNotification({
                        title: 'Error',
                        description: 'Hubo un problema al cerrar sesión. Intenta de nuevo más tarde.',
                        isChoice: false
                    });
                }
            }
        });
}
const handleDeleteAccount = async () => {
    showNotification({
            title: 'Confirmar eliminación',
            description: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
            leftButtonText: 'Cancelar',
            rightButtonText: 'Eliminar',
            highlightRight: true,
            isChoice: true,
            onLeftPress: () => hideNotification(),
            onRightPress: async () => {
                showNotification({
                    title: 'Última confirmación',
                    description: 'Esta es tu última oportunidad para cancelar. ¿Realmente deseas eliminar tu cuenta?',
                    leftButtonText: 'Eliminar',
                    rightButtonText: 'Cancelar',
                    highlightRight: false,
                    isChoice: true,
                    onLeftPress: async () => {
                        try {                            
                            await deleteAccount();
                            showNotification({
                                title: 'Cuenta eliminada',
                                description: 'Tu cuenta ha sido eliminada exitosamente.',
                                isChoice: false
                            });
                        } catch (error) {
                            console.error('Error al eliminar cuenta:', error);
                            showNotification({
                                title: 'Error',
                                description: 'Hubo un problema al eliminar tu cuenta. Intenta de nuevo más tarde.',
                                isChoice: false
                            });
                        }            
                    },
                    onRightPress: () => hideNotification()
                });
            }
        });
}

    return (
        <Screen>
            <ReturnButton route='/(tabs)/Profile' title='Configuración' />
            <View className="flex-1 p-4 mb-14">
                <View className="flex-1 gap-4">
                    <View>
                        <Text className="font-bold text-xl p-1 mb-1" style={{color: colors.primaryText}}>
                            Personalización
                        </Text>
                        <View className="flex-col justify-center gap-2 rounded-2xl p-2" style={{backgroundColor: `${colors.accent}33`}}>
                            <View className="border-b" style={{borderColor: `${colors.secondaryText}4D`}}>
                                <TouchableOpacity
                                    className="w-full flex-row gap-4 justify-between items-center p-2 pb-4"
                                    activeOpacity={0.4}
                                    onPress={() => router.push({ pathname: '/editProfile' , params: { username, description } })}>
                                    <View className="flex-row items-center gap-2 justify-start">
                                        <AntDesign name="edit" size={24} color={colors.primaryText} />
                                        <Text className="text-lg" style={{color: colors.primaryText}}>Editar perfil</Text>
                                    </View>         
                                    <View>
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondaryText}/>
                                    </View>                       
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                className="w-full flex-row gap-4 justify-between items-center p-2"
                                activeOpacity={0.4}
                                onPress={toggleTheme}>
                                <View className="flex-row items-center gap-2 justify-start">
                                    <FontAwesome5 name="palette" size={24} color={colors.primaryText} />
                                    <Text className="text-lg" style={{color: colors.primaryText}}>Cambiar tema</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="font-bold text-xl p-1 mb-1" style={{color: colors.primaryText}}>
                            Cuenta
                        </Text>
                        <View className="flex-col justify-center gap-2 rounded-2xl p-2" style={{backgroundColor: `${colors.accent}33`}}>
                            <View className="border-b" style={{borderColor: `${colors.secondaryText}4D`}}>
                                <TouchableOpacity
                                    className="w-full flex-row gap-4 justify-between items-center p-2 pb-4"
                                    activeOpacity={0.4}
                                    onPress={handleCloseSession}>
                                    <View className="flex-row items-center justify-start gap-2">
                                        <Ionicons name="log-out-outline" size={24} color={colors.primaryText} />
                                        <Text className="text-lg" style={{color: colors.primaryText}}>Cerrar sesión</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                className="w-full flex-row gap-4 justify-between items-center p-2"
                                activeOpacity={0.4}
                                onPress={handleDeleteAccount}>
                                <View className="flex-row items-center justify-start gap-2">
                                    <Ionicons name="trash-outline" size={24} color={colors.error} />
                                    <Text className="text-lg font-bold" style={{color: colors.error}}>Eliminar cuenta</Text>
                                </View>                                
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="font-bold text-xl p-1 mb-1" style={{color: colors.primaryText}}>
                            Soporte y legal
                        </Text>
                        <View className="flex-col justify-center gap-2 rounded-2xl p-2" style={{backgroundColor: `${colors.accent}33`}}>
                            <View className="border-b" style={{borderColor: `${colors.secondaryText}4D`}}>
                                <TouchableOpacity
                                    className="w-full flex-row gap-4 justify-between items-center p-2 pb-4"
                                    activeOpacity={0.4}
                                    onPress={() => Linking.openURL('https://forms.gle/2FCL2eyicn4yLuTw8')}>
                                    <View className="flex-row items-center justify-start gap-2">
                                        <MaterialIcons name="feedback" size={24} color={colors.primaryText}/>
                                        <Text className="text-lg" style={{color: colors.primaryText}}>Enviar feedback</Text>
                                    </View>
                                    <View>
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondaryText}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="border-b" style={{borderColor: `${colors.secondaryText}4D`}}>
                                <TouchableOpacity
                                    className="w-full flex-row gap-4 justify-between items-center p-2 pb-4"
                                    activeOpacity={0.4}
                                    onPress={() => router.push('/aboutUs')}>
                                    <View className="flex-row items-center justify-start gap-2">
                                        <Ionicons name="information-circle-outline" size={24} color={colors.primaryText} />
                                        <Text className="text-lg" style={{color: colors.primaryText}}>Sobre nosotros</Text>
                                    </View>
                                    <View>
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondaryText}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            <TouchableOpacity
                                className="w-full flex-row gap-4 justify-between items-center p-2"
                                activeOpacity={0.4}
                                onPress={() => Linking.openURL('https://topfive-politica-privacidad.vercel.app/')}>
                                <View className="flex-row items-center justify-start gap-2">
                                    <FontAwesome name="check-circle-o" size={24} color={colors.primaryText} />
                                    <Text className="text-lg" style={{color: colors.primaryText}}>Política de privacidad</Text>
                                </View>
                                <View>
                                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondaryText}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
}
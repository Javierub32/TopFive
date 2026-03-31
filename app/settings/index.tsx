import { ReturnButton } from 'components/ReturnButton';
import {
  TouchableOpacity,
  View,
  Text,
  TextComponent,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Screen } from 'components/Screen';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons/';
import { useTheme } from 'context/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from 'context/AuthContext';
import { useNotification } from 'context/NotificationContext';
import { AdsConsent } from 'lib/adsConsent';
import { useState } from "react";
export default function SettingsScreen() {
  const { signOut, deleteAccount } = useAuth();

  const { colors, changeTheme, themePreference } = useTheme();
  const { username, description } = useLocalSearchParams();
  const { showNotification, hideNotification } = useNotification();
  const [ showThemeOptions, setShowThemeOptions ] = useState(false);

  const handleRevokeConsent = async () => {
    if (Platform.OS === 'web') return;

    try {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (consentInfo.isConsentFormAvailable) {
        await AdsConsent.showForm();
      } else {
        showNotification({
          title: 'Aviso',
          description: 'El formulario de privacidad no está disponible en tu región.',
          isChoice: false,
          delete: false,
          success: false,
        });
      }
    } catch (error) {
      console.error('Error mostrando formulario de privacidad:', error);
    }
  };

  const handleCloseSession = async () => {
    showNotification({
      title: 'Confirmar cierre de sesión',
      description: '¿Estás seguro de que deseas cerrar sesión?',
      leftButtonText: 'Cancelar',
      rightButtonText: 'Cerrar sesión',
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        try {
          hideNotification(); // Ocultar antes de cerrar sesión
          await signOut();

          // En móvil nativo, mostrar notificación de éxito
          // En web (PC y móvil), el _layout manejará la redirección automáticamente
          if (Platform.OS !== 'web') {
            showNotification({
              title: 'Sesión cerrada',
              description: 'Has cerrado sesión exitosamente.',
              isChoice: false,
              delete: false,
              success: true,
            });
          }
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          showNotification({
            title: 'Error',
            description: 'Hubo un problema al cerrar sesión. Intenta de nuevo más tarde.',
            isChoice: false,
            delete: false,
            success: false,
          });
        }
      },
    });
  };
  const handleDeleteAccount = async () => {
    showNotification({
      title: 'Confirmar eliminación',
      description:
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      leftButtonText: 'Cancelar',
      rightButtonText: 'Eliminar',
      highlightRight: true,
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();
        showNotification({
          title: 'Última confirmación',
          description:
            'Esta es tu última oportunidad para cancelar. ¿Realmente deseas eliminar tu cuenta?',
          leftButtonText: 'Eliminar',
          rightButtonText: 'Cancelar',
          highlightRight: false,
          isChoice: true,
          delete: true,
          success: false,
          onLeftPress: async () => {
            try {
              hideNotification();
              await deleteAccount();
              showNotification({
                title: 'Cuenta eliminada',
                description: 'Tu cuenta ha sido eliminada exitosamente.',
                isChoice: false,
                delete: false,
                success: true,
              });
            } catch (error) {
              console.error('Error al eliminar cuenta:', error);
              showNotification({
                title: 'Error',
                description: 'Hubo un problema al eliminar tu cuenta. Intenta de nuevo más tarde.',
                isChoice: false,
                delete: false,
                success: false,
              });
            }
          },
          onRightPress: () => hideNotification(),
        });
      },
    });
  };

  return (
    <Screen>
      <ReturnButton route="/(tabs)/Profile" title="Configuración" />
      <View className="mb-14 flex-1 p-4">
        <View className="flex-1 gap-4">
          <View>
            <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
              Personalización
            </Text>
            <View
              className="flex-col justify-center gap-2 rounded-2xl p-2"
              style={{ backgroundColor: `${colors.accent}33` }}>
              <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                <TouchableOpacity
                  className="w-full flex-row items-center justify-between gap-4 p-2 pb-4"
                  activeOpacity={0.4}
                  onPress={() =>
                    router.push({ pathname: '/editProfile', params: { username, description } })
                  }>
                  <View className="flex-row items-center justify-start gap-2">
                    <AntDesign name="edit" size={24} color={colors.primaryText} />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      Editar perfil
                    </Text>
                  </View>
                  <View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.secondaryText}
                    />
                  </View>
                </TouchableOpacity>
              </View>
                
              <View>
                <TouchableOpacity
                className="w-full flex-row items-center justify-between gap-4 p-2"
                activeOpacity={0.4}
                onPress={() => setShowThemeOptions(!showThemeOptions)}>
                  <View className="flex-row items-center justify-start gap-2">
                    <FontAwesome5 name="palette" size={24} color={colors.primaryText} />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      Cambiar tema
                    </Text>
                  </View>
                </TouchableOpacity>
                {showThemeOptions && (
                  <View className="flex-row justify-between gap-2 mt-2">
                    <TouchableOpacity 
                    className="flex-1 p-4 rounded-xl items-center justify-center" 
                    style={{backgroundColor: colors.background, borderWidth: 2, borderColor: themePreference === 'dark' ? colors.accent : 'transparent'}}
                    onPress={() => changeTheme('dark')}>
                      <MaterialIcons name="dark-mode" size={24} color={colors.primaryText} />
                      <Text className="text-sm font-semibold text-center" style={{color: colors.primaryText}}>Oscuro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    className="flex-1 p-4 rounded-xl items-center justify-center" 
                    style={{backgroundColor: colors.background, borderWidth: 2, borderColor: themePreference === 'light' ? colors.accent : 'transparent'}}
                    onPress={() => changeTheme('light')}>
                      <MaterialIcons name="light-mode" size={24} color={colors.primaryText} />
                      <Text className="text-sm font-semibold text-center" style={{color: colors.primaryText}}>Claro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    className="flex-1 p-4 rounded-xl items-center justify-center" 
                    style={{backgroundColor: colors.background, borderWidth: 2, borderColor: themePreference === 'system' ? colors.accent : 'transparent' }}
                    onPress={() => changeTheme('system')}>
                      <MaterialCommunityIcons name="cellphone-cog" size={24} color={colors.primaryText} />
                      <Text className="text-sm font-semibold text-center" style={{color: colors.primaryText}}>Sistema</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View>
            <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
              Cuenta
            </Text>
            <View
              className="flex-col justify-center gap-2 rounded-2xl p-2"
              style={{ backgroundColor: `${colors.accent}33` }}>
              <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                <TouchableOpacity
                  className="w-full flex-row items-center justify-between gap-4 p-2 pb-4"
                  activeOpacity={0.4}
                  onPress={handleCloseSession}>
                  <View className="flex-row items-center justify-start gap-2">
                    <Ionicons name="log-out-outline" size={24} color={colors.primaryText} />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      Cerrar sesión
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="w-full flex-row items-center justify-between gap-4 p-2"
                activeOpacity={0.4}
                onPress={handleDeleteAccount}>
                <View className="flex-row items-center justify-start gap-2">
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                  <Text className="text-lg font-bold" style={{ color: colors.error }}>
                    Eliminar cuenta
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
              Soporte y legal
            </Text>
            <View
              className="flex-col justify-center gap-2 rounded-2xl p-2"
              style={{ backgroundColor: `${colors.accent}33` }}>
              <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                <TouchableOpacity
                  className="w-full flex-row items-center justify-between gap-4 p-2 pb-4"
                  activeOpacity={0.4}
                  onPress={() => Linking.openURL('https://forms.gle/2FCL2eyicn4yLuTw8')}>
                  <View className="flex-row items-center justify-start gap-2">
                    <MaterialIcons name="feedback" size={24} color={colors.primaryText} />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      Enviar feedback
                    </Text>
                  </View>
                  <View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.secondaryText}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                <TouchableOpacity
                  className="w-full flex-row items-center justify-between gap-4 p-2 pb-4"
                  activeOpacity={0.4}
                  onPress={() => router.push('/aboutUs')}>
                  <View className="flex-row items-center justify-start gap-2">
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color={colors.primaryText}
                    />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      Sobre nosotros
                    </Text>
                  </View>
                  <View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.secondaryText}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="w-full flex-row items-center justify-between gap-4 p-2"
                activeOpacity={0.4}
                onPress={() => Linking.openURL('https://topfive-politica-privacidad.vercel.app/')}>
                <View className="flex-row items-center justify-start gap-2">
                  <FontAwesome name="check-circle-o" size={24} color={colors.primaryText} />
                  <Text className="text-lg" style={{ color: colors.primaryText }}>
                    Política de privacidad
                  </Text>
                </View>
                <View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.secondaryText}
                  />
                </View>
              </TouchableOpacity>
              {Platform.OS !== 'web' && (
                <View
                  className="mt-2 border-t pt-2"
                  style={{ borderColor: `${colors.secondaryText}4D` }}>
                  <TouchableOpacity
                    className="w-full flex-row items-center justify-between gap-4 p-2"
                    activeOpacity={0.4}
                    onPress={handleRevokeConsent}>
                    <View className="flex-row items-center justify-start gap-2">
                      <MaterialIcons name="security" size={24} color={colors.primaryText} />
                      <Text className="text-lg" style={{ color: colors.primaryText }}>
                        Privacidad de anuncios
                      </Text>
                    </View>
                    <View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={colors.secondaryText}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

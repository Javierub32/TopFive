import { ReturnButton } from 'components/ReturnButton';
import {
  TouchableOpacity,
  View,
  Text,
  TextComponent,
  Alert,
  Linking,
  Platform,
  Share,
  ScrollView,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SettingsScreen() {
  const { signOut, deleteAccount } = useAuth();

  const { colors, changeTheme, themePreference } = useTheme();
  const { username, description } = useLocalSearchParams();
  const { showNotification, hideNotification } = useNotification();
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);

  const { t, i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng); // Cambia el idioma en tiempo real
    await AsyncStorage.setItem('user_language_preference', lng); // Lo guarda para la próxima vez
  };

  const handleRevokeConsent = async () => {
    if (Platform.OS === 'web') return;

    try {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (consentInfo.isConsentFormAvailable) {
        await AdsConsent.showForm();
      } else {
        showNotification({
          title: t('common.warning'),
          description: t('settings.errors.privacyError.description'),
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
      title: t('settings.account.logOut.alertTitle'),
      description: t('settings.account.logOut.alertDescription'),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('settings.account.logOut.alertConfirmation'),
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();
        setTimeout(async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          }
        }, 300);
      },
    });
  };
  const handleDeleteAccount = async () => {
    showNotification({
      title: t('settings.account.deleteAccount.firstAlert.alertTitle'),
      description: t('settings.account.deleteAccount.firstAlert.alertDescription'),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('settings.account.deleteAccount.firstAlert.alertConfirmation'),
      highlightRight: true,
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: async () => {
        hideNotification();
        showNotification({
          title: t('settings.account.deleteAccount.secondAlert.alertTitle'),
          description: t('settings.account.deleteAccount.secondAlert.alertDescription'),
          leftButtonText: t('settings.account.deleteAccount.secondAlert.alertConfirmation'),
          rightButtonText: t('common.cancel'),
          highlightRight: false,
          isChoice: true,
          delete: true,
          success: false,
          onLeftPress: () => {
            hideNotification();

            setTimeout(async () => {
              try {
                await deleteAccount();
              } catch (error) {
                console.error('Error al eliminar cuenta:', error);
              }
            }, 300);
          },
          onRightPress: () => hideNotification(),
        });
      },
    });
  };

  const handleShare = async () => {
    if (!username) return;
    try {
      const url = `https://www.topfive5.me/details/user?username=${username}&from=link`;
      await Share.share({
        message: t('settings.account.share.shareMessage', { url }),
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
  };

  return (
    <Screen>
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <ReturnButton route="/(tabs)/Profile" title={t('settings.title')} />
        <View className="mb-14 flex-1 p-4">
          <View className="flex-1 gap-4">
            <View>
              <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
                {t('settings.personalization.title')}
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
                        {t('settings.personalization.editProfile.title')}
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

                <View
                  className="border-b pb-2"
                  style={{ borderColor: `${colors.secondaryText}4D` }}>
                  <TouchableOpacity
                    className="w-full flex-row items-center justify-between gap-4 p-2"
                    activeOpacity={0.4}
                    onPress={() => setShowThemeOptions(!showThemeOptions)}>
                    <View className="flex-row items-center justify-start gap-2">
                      <FontAwesome5 name="palette" size={24} color={colors.primaryText} />
                      <Text className="text-lg" style={{ color: colors.primaryText }}>
                        {t('settings.personalization.changeTheme.title')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showThemeOptions && (
                    <View className="mt-2 flex-row justify-between gap-2">
                      <TouchableOpacity
                        className="flex-1 items-center justify-center rounded-xl p-4"
                        style={{
                          backgroundColor: colors.background,
                          borderWidth: 2,
                          borderColor: themePreference === 'dark' ? colors.accent : 'transparent',
                        }}
                        onPress={() => changeTheme('dark')}>
                        <MaterialIcons name="dark-mode" size={24} color={colors.primaryText} />
                        <Text className="text-center text-sm" style={{ color: colors.primaryText }}>
                          {t('settings.personalization.changeTheme.darkMode')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 items-center justify-center rounded-xl p-4"
                        style={{
                          backgroundColor: colors.background,
                          borderWidth: 2,
                          borderColor: themePreference === 'light' ? colors.accent : 'transparent',
                        }}
                        onPress={() => changeTheme('light')}>
                        <MaterialIcons name="light-mode" size={24} color={colors.primaryText} />
                        <Text className="text-center text-sm" style={{ color: colors.primaryText }}>
                          {t('settings.personalization.changeTheme.lightMode')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 items-center justify-center rounded-xl p-4"
                        style={{
                          backgroundColor: colors.background,
                          borderWidth: 2,
                          borderColor: themePreference === 'system' ? colors.accent : 'transparent',
                        }}
                        onPress={() => changeTheme('system')}>
                        <MaterialCommunityIcons
                          name="cellphone-cog"
                          size={24}
                          color={colors.primaryText}
                        />
                        <Text className="text-center text-sm" style={{ color: colors.primaryText }}>
                          {t('settings.personalization.changeTheme.systemMode')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Cambiar idioma */}
                <View>
                  <TouchableOpacity
                    className="w-full flex-row items-center justify-between gap-4 p-2"
                    activeOpacity={0.4}
                    onPress={() => setShowLangOptions(!showLangOptions)}>
                    <View className="flex-row items-center justify-start gap-2">
                      <MaterialIcons name="language" size={24} color={colors.primaryText} />
                      <Text className="text-lg" style={{ color: colors.primaryText }}>
                        {t('settings.personalization.changeLanguage')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showLangOptions && (
                    <View className="mt-2 flex-row justify-between gap-2">
                      <TouchableOpacity
                        className="flex-1 items-center justify-center rounded-xl p-4"
                        style={{
                          backgroundColor: colors.background,
                          borderWidth: 2,
                          borderColor: i18n.language === 'es' ? colors.accent : 'transparent',
                        }}
                        onPress={() => changeLanguage('es')}>
                        <Text
                          className="font-sans text-base font-bold uppercase tracking-wider"
                          style={{ color: colors.primaryText }}>
                          ES
                        </Text>
                        <Text className="text-sm" style={{ color: colors.primaryText }}>
                          {t('languages.es')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 items-center justify-center rounded-xl p-4"
                        style={{
                          backgroundColor: colors.background,
                          borderWidth: 2,
                          borderColor: i18n.language === 'en' ? colors.accent : 'transparent',
                        }}
                        onPress={() => changeLanguage('en')}>
                        <Text
                          className="font-sans text-base font-bold uppercase tracking-wider"
                          style={{ color: colors.primaryText }}>
                          EN
                        </Text>
                        <Text className="text-sm" style={{ color: colors.primaryText }}>
                          {t('languages.en')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View>
              <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
                {t('settings.account.title')}
              </Text>
              <View
                className="flex-col justify-center gap-2 rounded-2xl p-2"
                style={{ backgroundColor: `${colors.accent}33` }}>
                <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                  <TouchableOpacity
                    className="w-full flex-row items-center justify-between p-2 pb-4 pl-1"
                    activeOpacity={0.4}
                    onPress={handleShare}>
                    <View className="flex-row items-center justify-start gap-2">
                      <Ionicons name="share-outline" size={24} color={colors.primaryText} />
                      <Text className="text-lg" style={{ color: colors.primaryText }}>
                        {t('settings.account.share.title')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="border-b" style={{ borderColor: `${colors.secondaryText}4D` }}>
                  <TouchableOpacity
                    className="w-full flex-row items-center justify-between p-2 pb-4"
                    activeOpacity={0.4}
                    onPress={handleCloseSession}>
                    <View className="flex-row items-center justify-start gap-2">
                      <Ionicons name="log-out-outline" size={24} color={colors.primaryText} />
                      <Text className="text-lg" style={{ color: colors.primaryText }}>
                        {t('settings.account.logOut.title')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="w-full flex-row items-center justify-between p-2"
                  activeOpacity={0.4}
                  onPress={handleDeleteAccount}>
                  <View className="flex-row items-center justify-start gap-2">
                    <Ionicons name="trash-outline" size={24} color={colors.error} />
                    <Text className="text-lg font-bold" style={{ color: colors.error }}>
                      {t('settings.account.deleteAccount.title')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="mb-1 p-1 text-xl font-bold" style={{ color: colors.primaryText }}>
                {t('settings.legal.title')}
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
                        {t('settings.legal.sendFeed')}
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
                        {t('settings.legal.aboutUs.title')}
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
                  onPress={() =>
                    Linking.openURL('https://topfive-politica-privacidad.vercel.app/')
                  }>
                  <View className="flex-row items-center justify-start gap-2">
                    <FontAwesome name="check-circle-o" size={24} color={colors.primaryText} />
                    <Text className="text-lg" style={{ color: colors.primaryText }}>
                      {t('settings.legal.privacy')}
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
                          {t('settings.legal.adsPriv')}
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
      </ScrollView>
    </Screen>
  );
}

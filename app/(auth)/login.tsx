import { useState } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { supabase } from 'lib/supabase';
import {
  GoogleSignin,
  isSuccessResponse
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';

// Frases aleatorias con iconos - fuera del componente para mejor rendimiento
const frasesConIconos = [
  { translationKey: 'login.loginSentences.1', icono: 'movie-open' },
  { translationKey: 'login.loginSentences.2', icono: 'archive-star' },
  { translationKey: 'login.loginSentences.3', icono: 'bookmark-check' },
  { translationKey: 'login.loginSentences.4', icono: 'podium-gold' },
  { translationKey: 'login.loginSentences.5', icono: 'music-box-multiple' },
] as const;

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
});

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useNotification();

  const { colors } = useTheme();
  const { t } = useTranslation();

  // Seleccionar una frase aleatoria - se ejecuta cada vez que se renderiza el componente
  const fraseAleatoria = useState(
    () => frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];

  const handleLogin = async () => {
    alert('Web ID: ' + process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    setLoading(true);
    try {
      await signIn(email, password);
      // No necesitamos navegar manualmente, el _layout.js lo hará al detectar la sesión
    } catch (error) {
      //Alert.alert('Error', 'Credenciales inválidas. \n Por favor, inténtalo de nuevo.');
      showNotification({
        title: 'Error',
        description: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleNativeGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } else {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const response = await GoogleSignin.signIn();

        let token: string | null = null;
        if (isSuccessResponse(response)) {
          token = response.data.idToken;
        }

        if (!token) throw new Error('Google no devolvió un ID Token');

        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: token,
        });

        if (error) throw error;

        showNotification({
          title: t('login.loginNotification.title'),
          description: t('login.loginNotification.description'),
          isChoice: false,
          delete: false,
          success: true,
        });
      }
    } catch (error: any) {
      console.error(error);
      console.log('statusCode:', error.code);
      console.log('message:', error.message);
      showNotification({
        title: 'Error',
        description: error.message,
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) throw error;
        showNotification({
          title: t('login.loginNotification.title'),
          description: t('login.loginNotification.description'),
          isChoice: false,
          delete: false,
          success: true,
        });
      }
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        console.log('El usuario canceló el inicio de sesión con Apple');
      } else {
        Alert.alert('Error de Apple', e.message || 'Error desconocido');
      }
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.background, colors.secondary, colors.secondary]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ width: '100%', maxWidth: 550 }}>
          {/* Título con icono */}
          <View className="mb-4 flex-row items-center justify-center">
            <View
              className="mr-3 rounded-full p-3"
              style={{ backgroundColor: `${colors.primaryText}20` }}>
              <MaterialCommunityIcons
                name={fraseAleatoria.icono as any}
                size={40}
                color={colors.primaryText}
              />
            </View>
            <AppText style={{ fontSize: 24, fontWeight: 'bold', color: colors.primaryText }}>
              {t('common.appName')}
            </AppText>
          </View>

          {/* Frase aleatoria */}
          <AppText
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
              color: colors.primaryText,
              opacity: 0.9,
              fontStyle: 'italic',
            }}>
            {t(fraseAleatoria.translationKey)}
          </AppText>

          <View
            className="rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.background }}>
            {/* Email Input */}
            <View className="mb-4">
              <AppText className="mb-1 ml-1 font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.email.title')}
              </AppText>
              <View
                className="mb-3 flex-row items-center rounded-xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceButton }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={colors.secondaryText}
                />
                <AppTextInput
                  placeholder={t('login.email.placeholder')}
                  placeholderTextColor={colors.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="ml-3 flex-1 text-base"
                  style={{ color: colors.primaryText, lineHeight: 17 }}
                />
              </View>
              <AppText className="mb-1 ml-1 font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.password')}
              </AppText>
              <View
                className="flex-row items-center rounded-xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceButton }}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={24}
                  color={colors.secondaryText}
                />
                <AppTextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  className="text-base"
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry={!showPassword}
                  style={{
                    fontSize: 14,
                    flex: 1,
                    marginLeft: 12,
                    marginRight: 8,
                    color: colors.primaryText,
                    minWidth: 0,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              <View className="my-4 pr-1" style={{}}>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password')}
                  disabled={loading}
                  className="items-end">
                  <AppText className="" style={{ fontSize: 14, color: colors.secondaryText }}>
                    {t('login.forgotPassword.title')}
                  </AppText>
                </TouchableOpacity>
              </View>

              <View className="py-2" style={{}}>
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  className="items-center overflow-hidden rounded-xl py-3.5 shadow-lg"
                  style={{ backgroundColor: colors.accent }}>
                  <AppText className="text-lg font-bold" style={{ fontSize: 14, color: colors.primaryText }}>
                    {loading ? t('common.loading') : t('login.loginButton')}
                  </AppText>
                </TouchableOpacity>
              </View>

              {Platform.OS === 'ios' && (
                <View className="my-6 flex-row items-center">
                  <View
                    className="h-[1px] flex-1"
                    style={{ backgroundColor: colors.secondaryText, opacity: 0.3 }}></View>

                  <AppText
                    className="mx-4 text-sm font-medium"
                    style={{ fontSize: 14, color: colors.secondaryText }}>
                    o
                  </AppText>
                  <View
                    className="h-[1px] flex-1"
                    style={{ backgroundColor: colors.secondaryText, opacity: 0.3 }}></View>
                </View>
              )}

              <View className="" style={{}}>
                <TouchableOpacity
                  onPress={handleNativeGoogleLogin}
                  disabled={loading}
                  className="items-center overflow-hidden rounded-xl py-3.5 shadow-lg"
                  style={{ backgroundColor: '#FFFFFF' }}>
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={require('assets/google-color-icon.png')}
                      style={{ width: 24, height: 24, marginRight: 10 }}
                      resizeMode="contain"
                    />
                    <AppText className="text-lg font-bold" style={{ fontSize: 14, color: '#000000' }}>
                      {t('login.loginWithGoogle')}
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>

              {Platform.OS === 'ios' && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                  style={{ width: '100%', height: 50, marginTop: 7 }}
                  cornerRadius={10}
                  onPress={handleAppleLogin}
                  className="items-center overflow-hidden rounded-xl py-4 shadow-lg"
                />
              )}
            </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <AppText className="mb-2 text-base" style={{ fontSize: 14, color: colors.primaryText }}>
              {t('login.noAccount')}
            </AppText>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              className="rounded-full px-6 py-3"
              style={{ backgroundColor: `${colors.surfaceButton}80` }}>
              <AppText className="text-base font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.signUpButton')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

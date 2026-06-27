import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { supabase } from 'lib/supabase'; // Añadido Supabase
import * as Linking from 'expo-linking';
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

export default function ResetPasswordScreen() {
  const { changePassword, session } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { colors } = useTheme();
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const fraseAleatoria = useState(
    () => frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];

  const handleChangePassword = async () => {
    let activeSession = session;

    if (!activeSession) {
      try {
        setLoading(true);
        if (params.code) {
          const { data } = await supabase.auth.exchangeCodeForSession(params.code as string);
          activeSession = data?.session;
        } else if (params.access_token && params.refresh_token) {
          const { data } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });
          activeSession = data?.session;
        }

        // 2. Si sigue sin encontrarlo, analizamos la URL pura
        if (!activeSession) {
          const url = await Linking.getInitialURL();
          if (url) {
            const codeMatch = url.match(/code=([^&]+)/);
            if (codeMatch) {
              const { data } = await supabase.auth.exchangeCodeForSession(codeMatch[1]);
              activeSession = data?.session;
            } else {
              const accessMatch = url.match(/access_token=([^&]+)/);
              const refreshMatch = url.match(/refresh_token=([^&]+)/);
              if (accessMatch && refreshMatch) {
                const { data } = await supabase.auth.setSession({
                  access_token: accessMatch[1],
                  refresh_token: refreshMatch[1],
                });
                activeSession = data?.session;
              }
            }
          }
        }
      } catch (e) {
        console.error('Error intentando rescatar la sesión desde la URL:', e);
      }
    }

    // Si después de todo esto sigue sin haber sesión, mostramos el error
    if (!activeSession) {
      setLoading(false);
      showNotification({
        title: t('login.resetPassword.error.denied'),
        description: t('login.resetPassword.error.errorLink'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      showNotification({
        title: t('common.error'),
        description: t('login.resetPassword.error.passwordMismatch'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword(password);

      if (Platform.OS === 'web') {
        window.location.href = '/password-changed.html';
      } else {
        router.replace('/(auth)/login');

        setTimeout(() => {
          showNotification({
            title: t('common.success'),
            description: t('login.resetPassword.successDescription'),
            isChoice: false,
            delete: false,
            success: true,
          });
        }, 200);
      }
    } catch (error: any) {
      let errorMessage = t('login.resetPassword.error.general');

      if (error && error.message) {
        const msg = error.message.toLowerCase();

        if (msg.includes('different from the old password') || msg.includes('same password')) {
          errorMessage = t('login.resetPassword.error.differentPassword');
        } else if (msg.includes('security purposes') || msg.includes('rate limit')) {
          errorMessage = t('login.resetPassword.error.rateLimit');
        } else if (msg.includes('missing') || msg.includes('expired') || msg.includes('session')) {
          errorMessage = t('login.resetPassword.error.errorLink');
        } else {
          errorMessage = error.message;
        }
      }

      showNotification({
        title: t('login.resetPassword.error.default'),
        description: errorMessage,
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
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
            {' ' + t(fraseAleatoria.translationKey)}
          </AppText>

          <View
            className="rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.background }}>
            {/* Email Input */}
            <View className="mb-4">
              <AppText className="my-3 ml-1 font-semibold " style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.resetPassword.newPassword')}
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
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry={!showPassword}
                  style={{ color: colors.primaryText, fontSize: 14 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              <AppText className="my-3 ml-1 font-semibold " style={{ color: colors.primaryText, fontSize: 14 }}>
                {t('login.resetPassword.confirmPassword')}
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
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry={!showPassword}
                  style={{ color: colors.primaryText, fontSize: 14 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              <View className="mt-4" style={{}}>
                <TouchableOpacity
                  onPress={handleChangePassword}
                  disabled={loading}
                  className="items-center overflow-hidden rounded-xl py-4 shadow-lg"
                  style={{ backgroundColor: colors.accent }}>
                  <AppText className="text-lg font-bold" style={{ fontSize: 14, color: colors.primaryText }}>
                    {loading ? t('common.loading') : t('login.resetPassword.changePassword')}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

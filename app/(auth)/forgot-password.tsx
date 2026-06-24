import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { ReturnButton } from 'components/ReturnButton';
import { supabase } from 'lib/supabase';
import { userService } from '@/User/services/userService';
import { useTranslation } from 'react-i18next';

// Las frases no se imprimen.
const frasesConIconos = [
  'movie-open',
  'archive-star',
  'bookmark-check',
  'podium-gold',
  'music-box-multiple',
];

export default function ForgotPasswordScreen() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  // Seleccionar una frase aleatoria - se ejecuta cada vez que se renderiza el componente
  const fraseAleatoria = useState(
    () => frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];
  //Comprobamos antes si el email está registrado para evitar enviar correos innecesarios
  const handleReset = async () => {
    setLoading(true);
    try {
      const registered = await userService.checkEmail(email);
      if (!registered) {
        showNotification({
          title: t('common.error'),
          description: t('login.forgotPassword.emailNotRegistered'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      }

      await requestReset(email);
      router.replace('/(auth)/login');
      showNotification({
        title: t('common.success'),
        description: t('login.forgotPassword.emailSent'),
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error) {
      showNotification({
        title: t('common.error'),
        description: t('login.forgotPassword.errorEmailSent'),
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
      <View className="absolute left-0 top-9 z-10">
        <ReturnButton route="back" title="" />
      </View>
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
                name={fraseAleatoria as any}
                size={40}
                color={colors.primaryText}
              />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primaryText }}>
              {t('common.appName')}
            </Text>
          </View>

          {/* Frase aleatoria */}
          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
              color: colors.primaryText,
              opacity: 0.9,
              fontStyle: 'italic',
            }}>
            {t('login.forgotPassword.subtitle')}
          </Text>

          <View
            className="rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.background }}>
            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-1 ml-1 font-semibold" style={{ color: colors.primaryText }}>
                {t('login.email.title')}
              </Text>
              <View
                className="mb-3 flex-row items-center rounded-xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceButton }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={colors.secondaryText}
                />
                <TextInput
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
              <View className="mt-4" style={{}}>
                <TouchableOpacity
                  onPress={handleReset}
                  disabled={loading}
                  className="items-center overflow-hidden rounded-xl py-4 shadow-lg"
                  style={{ backgroundColor: colors.accent }}>
                  <Text className="text-lg font-bold" style={{ color: colors.primaryText }}>
                    {loading ? t('common.loading') : t('common.send')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 },
});

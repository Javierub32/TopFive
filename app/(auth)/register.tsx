import { useState } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';


export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const { showNotification, hideNotification } = useNotification();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        showNotification({
          title: t('common.error'),
          description: t('login.signUp.errors.passwordMismatch'),
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      }
      await signUp(email, password, username.trim());
      router.replace('/(auth)/login');
      showNotification({
        title: t('login.signUp.success.title'),
        description: <AppText>{t('login.signUp.success.description')}</AppText>,
        isChoice: true,
        rightButtonText: t('common.accept'),
        onRightPress: () => {
          hideNotification();
        },
        delete: false,
        success: true,
      });
    } catch (error: any) {
      //Alert.alert('Error', error.message || 'Hubo un error al crear tu cuenta.');
      showNotification({
        title: t('common.error'),
        description: error.message || t('login.signUp.errors.general'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const screenHeight = Dimensions.get('screen').height;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* EL FONDO INAMOVIBLE */}
      <LinearGradient
        colors={[colors.background, colors.secondary, colors.secondary]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: screenHeight,
        }}
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}>
        <View style={{ flex: 1 }} />

        <View style={{ width: '100%', maxWidth: 550, alignSelf: 'center', paddingHorizontal: 20 }}>
          <View className="mb-4 flex-row items-center justify-center">
            <View
              className="mr-3 rounded-full p-3"
              style={{ backgroundColor: `${colors.primaryText}20` }}>
              <MaterialCommunityIcons name="movie-open" size={40} color={colors.primaryText} />
            </View>
            <AppText style={{ fontSize: 24, fontWeight: 'bold', color: colors.primaryText }}>
              {t('common.appName')}
            </AppText>
          </View>

          <AppText
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
              color: colors.primaryText,
              opacity: 0.9,
              fontStyle: 'italic',
            }}>
            {t('login.signUp.subtitle')}
          </AppText>

          <View
            className="rounded-3xl p-6 shadow-2xl"
            style={{ backgroundColor: colors.background }}>
            <View className="mb-4">
              <AppText className="mb-2 ml-1 font-semibold" style={{fontSize: 14, color: colors.primaryText }}>
                {t('login.signUp.username')}
              </AppText>
              <View
                className="mb-3 flex-row items-center rounded-xl px-4 py-3"
                style={{ backgroundColor: colors.surfaceButton }}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color={colors.secondaryText}
                />
                <AppTextInput
                  placeholder={t('login.signUp.usernamePlaceholder')}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  style={{ color: colors.primaryText, lineHeight: 17, fontSize: 14 }}
                />
              </View>

              {/* Email Input */}
              <AppText className="mb-2 ml-1 font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.signUp.email')}
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
                  placeholder={t('login.signUp.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  style={{ color: colors.primaryText, lineHeight: 17, fontSize: 14 }}
                />
              </View>

              {/* Password Input */}
              <AppText className="mb-2 ml-1 font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.signUp.password')}
              </AppText>
              <View
                className="mb-3 flex-row items-center rounded-xl px-4 py-3"
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
                  style={{
                    color: colors.primaryText,
                    lineHeight: 17,
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={!showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <AppText className="mb-2 ml-1 font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.signUp.confirmPassword')}
              </AppText>
              <View
                className="mb-3 flex-row items-center rounded-xl px-4 py-3"
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
                  style={{
                    color: colors.primaryText,
                    lineHeight: 17,
                    fontSize: 14,
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={!showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              {/* Botón Registro */}
              <View className="mt-6">
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className="items-center overflow-hidden rounded-xl py-4 shadow-lg"
                  style={{ backgroundColor: colors.accent }}>
                  <AppText className="text-lg font-bold" style={{ fontSize: 14, color: colors.primaryText }}>
                    {loading ? t('common.loadingCreating') : t('login.signUp.signUpButton')}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Enlace al Login */}
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <AppText className="mb-2 text-base" style={{ fontSize: 14, color: colors.primaryText }}>
              {t('login.signUp.alreadyHaveAccount')}
            </AppText>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="rounded-full px-6 py-3"
              style={{ backgroundColor: `${colors.surfaceButton}80` }}>
              <AppText className="text-base font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('login.signUp.loginButton')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Espaciador inferior */}
        <View style={{ flex: 1 }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

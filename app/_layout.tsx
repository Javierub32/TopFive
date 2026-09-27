import '../global.css';
import '../i18n';
import 'react-native-gesture-handler';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppState, View, Linking, Platform } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from 'context/ThemeContext';
import { CollectionProvider } from 'context/CollectionContext';
import { NotificationProvider, useNotification } from 'context/NotificationContext';
import { SearchProvider } from 'context/SearchContext';
import Constants from 'expo-constants';
import { NotificationModal } from 'components/NotificationModal';
import { AdsConsent, AdsConsentStatus } from 'lib/adsConsent';
import { registerForPushNotificationsAsync } from 'lib/pushNotifications';
import { FontSizeProvider } from 'context/FontSizeContext';
import { useTranslation } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/queryClient';
import { useAppVersion } from '@/AppVersion/hooks/useAppVersion';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StartupGate } from '@/AppVersion/components/StartupGate';

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const { showNotification, hideNotification, visible, config } = useNotification();
  const { t } = useTranslation();
  const { appVersion, error: appVersionError, compareVersions } = useAppVersion({refetchOnMount: false});
  const notifiedAppVersionRef = useRef<string | null>(null);
  const previousSessionUserIdRef = useRef<string | null>(null);

  const remoteVersion =
    Platform.OS === 'android' ? appVersion?.version_android : appVersion?.version;

  useEffect(() => {
    let previousAppState = AppState.currentState;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const returnedToApp =
        /inactive|background/.test(previousAppState) && nextAppState === 'active';

      if (returnedToApp) {
        queryClient.invalidateQueries();
      }

      previousAppState = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loading) return;

    const currentUserId = session?.user.id ?? null;
    const sessionChanged =
      previousSessionUserIdRef.current !== null &&
      previousSessionUserIdRef.current !== currentUserId;

    if (sessionChanged) {
      queryClient.clear();
    }

    previousSessionUserIdRef.current = currentUserId;
  }, [loading, session]);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          ...FontAwesome.font,
          ...MaterialCommunityIcons.font,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    const initAdsConsent = async () => {
      if (Platform.OS === 'web') return;

      try {
        let attStatus = 'granted';

        if (Platform.OS === 'ios') {
          const TrackingTransparency = require('expo-tracking-transparency');

          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
          attStatus = status;
        }

        if (Platform.OS === 'ios' && attStatus !== 'granted') {
          return;
        }

        const consentInfo = await AdsConsent.requestInfoUpdate();
        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdsConsentStatus.REQUIRED
        ) {
          await AdsConsent.showForm();
        }
      } catch (error) {
        console.error('Error con el consentimiento de anuncios:', error);
      }
    };

    if (appIsReady) {
      initAdsConsent();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (appIsReady && session) {
      registerForPushNotificationsAsync(session.user.id);
    }
  }, [appIsReady, session]);

  useEffect(() => {
    if (appVersionError) {
      console.error('Error verificando versión de la app:', appVersionError);
      return;
    }

    if (!appIsReady || !remoteVersion || Platform.OS === 'web') return;
    if (notifiedAppVersionRef.current === remoteVersion) return;

    const localVersion = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

    if (compareVersions(remoteVersion, localVersion) <= 0) return;

    const storeUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.leftjoiners.topfive'
        : 'https://apps.apple.com/es/app/topfive/id6761102319';

    notifiedAppVersionRef.current = remoteVersion;

    showNotification({
      title: t('layout.updateAvailableTitle'),
      description: t('layout.updateAvailableDescription'),
      isChoice: true,
      rightButtonText: t('common.update'),
      onRightPress: () => {
        hideNotification();
        void Linking.openURL(storeUrl);
      },
      delete: false,
      success: false,
      info: true,
    });
  }, [
    appIsReady,
    appVersionError,
    compareVersions,
    hideNotification,
    remoteVersion,
    showNotification,
    t,
  ]);

  useEffect(() => {
    // Cuando las fuentes carguen (appIsReady) Y la sesión de Supabase esté lista (!loading),
    // ocultamos el Splash Screen.
    if (appIsReady && !loading) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, loading]);

  useEffect(() => {
    if (loading || !appIsReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    const isResettingPassword =
      segments.length > 1 && (segments as string[])[1] === 'reset-password';

    if (session) {
      if (isResettingPassword) return;
      // SI hay usuario:
      // Redirigir a Home si intenta entrar a login/registro (AuthGroup)
      // O si está en la raíz (segments.length === 0)
      if (inAuthGroup || (segments.length as number) === 0) {
        router.replace('/(tabs)/Home');
      }
    } else {
      // NO hay usuario:
      // Redirigir a Login si NO está ya en el grupo de autenticación.
      // (Esto cubre cualquier ruta protegida y la raíz)
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [router, session, loading, segments, appIsReady]);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: false,
          animation: 'fade_from_bottom',
        }}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
      <NotificationModal
        visible={visible}
        title={config.title}
        description={config.description}
        leftButtonText={config.leftButtonText}
        rightButtonText={config.rightButtonText}
        highlightRight={config.highlightRight}
        isChoice={config.isChoice}
        delete={config.delete}
        success={config.success}
        info={config.info}
        onLeftPress={config.onLeftPress}
        onRightPress={config.onRightPress}
        onClose={hideNotification}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
		 <FontSizeProvider>
              <ThemeProvider>
        <StartupGate>
          <AuthProvider>
                <CollectionProvider>
                  <NotificationProvider>
                    <SearchProvider>
                      <InitialLayout />
                    </SearchProvider>
                  </NotificationProvider>
                </CollectionProvider>
          </AuthProvider>
        </StartupGate>
		  </ThemeProvider>
  </FontSizeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

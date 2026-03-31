import '../global.css';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, Linking, Platform } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from 'context/ThemeContext';
import { CollectionProvider } from 'context/CollectionContext';
import { NotificationProvider, useNotification } from 'context/NotificationContext';
import { SearchProvider } from 'context/SearchContext';
import Constants from 'expo-constants';
import { supabase } from 'lib/supabase';
import { NotificationModal } from 'components/NotificationModal';
import { AdsConsent, AdsConsentStatus } from 'lib/adsConsent';


SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const { showNotification, hideNotification, visible, config } = useNotification();

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
      // Evitamos ejecutar esto en web
      if (Platform.OS === 'web') return;

      try {
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
    const checkAppVersion = async () => {
      try {
        const { data, error } = await supabase
          .from('version')
          .select('version')
          .single();

        if (error || !data) return;

        const remoteVersion = data.version;
        const localVersion = Constants.expoConfig?.version || Constants.nativeAppVersion || '1.0.0';

        // Función auxiliar para comparar versiones semánticas (X.Y.Z)
        const cmp = (v1: string, v2: string) => {
          const p1 = v1.split('.').map(Number);
          const p2 = v2.split('.').map(Number);
          for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
            const n1 = p1[i] || 0;
            const n2 = p2[i] || 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
          }
          return 0;
        };

        if (cmp(remoteVersion, localVersion) > 0 && Platform.OS === 'android') {
          showNotification({
            title: 'Actualización disponible',
            description: 'Hay una nueva versión de la aplicación disponible. Por favor, actualízala para seguir disfrutando de todas las novedades.',
            isChoice: true,
            rightButtonText: 'Actualizar', 
            onRightPress: () => {
              hideNotification();
              Linking.openURL('https://play.google.com/store/apps/details?id=com.leftjoiners.topfive');
            },
            delete: false
          });
        }
      } catch (e) {
        console.error('Error verificando versión de la app:', e);
      }
    };

    // Lanzamos el verificador solo cuando la app ya esté lista (fuentes cargadas, etc)
    if (appIsReady) {
      checkAppVersion();
    }
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (loading || !appIsReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    const isResettingPassword = segments.length > 1 && (segments as string[])[1] === 'reset-password';


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
  }, [session, loading, segments, appIsReady]);
  // Mostrar un indicador de carga mientras se decide la ruta o cargan fuentes
  if (!appIsReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Slot />
      <NotificationModal
        visible={visible}
        title={config.title}
        description={config.description}
        leftButtonText={config.leftButtonText}
        rightButtonText={config.rightButtonText}
        highlightRight={config.highlightRight}
        isChoice={config.isChoice}
        delete={config.delete}
        onLeftPress={config.onLeftPress}
        onRightPress={config.onRightPress}
        onClose={hideNotification}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
		<CollectionProvider>
		  <NotificationProvider>
			<SearchProvider>
			  <InitialLayout />
			</SearchProvider>
		  </NotificationProvider>
		</CollectionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
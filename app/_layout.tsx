import '../global.css';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from 'context/ThemeContext';
import { CollectionProvider } from 'context/CollectionContext';

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

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
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
		<CollectionProvider>
          <InitialLayout />
		</CollectionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
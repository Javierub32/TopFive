import '../global.css';

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ResourceProvider } from 'context/ResourceContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

// Mantener la splash screen visible mientras cargamos recursos
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Cargar fuentes/iconos
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
    const inTabsGroup = segments[0] === '(tabs)';

    // Redirigir solo si el usuario está en un grupo incorrecto
    if (!session && !inAuthGroup && segments.length > 0) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/Home');
    }
  }, [session, loading, segments, appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Slot />
    </View>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
		<ResourceProvider>
      		<InitialLayout />
		</ResourceProvider>
    </AuthProvider>
  );
}
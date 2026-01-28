import '../global.css';
import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router'; // <--- Importa useRootNavigationState
import { useEffect, useCallback, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ResourceProvider } from '../context/ResourceContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState(); // <--- Hook para verificar estado de navegación
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
    // 1. Verificamos si la navegación está lista (rootNavigationState.key)
    if (!rootNavigationState?.key) return;
    
    // 2. Si estamos cargando auth o fuentes, no hacemos nada aún
    if (loading || !appIsReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (session) {
      // SI hay usuario:
      // Redirigir a Home si intenta entrar a login/registro (AuthGroup) 
      // O si está en la raíz (segments[0] es undefined)
      if (inAuthGroup || !segments[0]) {
        router.replace('/(tabs)/Home');
      }
    } else {
      // NO hay usuario:
      // Redirigir a Login si NO está ya en el grupo de autenticación.
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [session, loading, segments, appIsReady, rootNavigationState?.key]); // <--- Añadimos la key a dependencias

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
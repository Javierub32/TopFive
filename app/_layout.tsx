import '../global.css';

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ResourceProvider } from 'context/ResourceContext';

const InitialLayout = () => {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    // Redirigir solo si el usuario está en un grupo incorrecto
    if (!session && !inAuthGroup && segments.length > 0) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/Home');
    }
  }, [session, loading, segments]);

  return <Slot />;
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
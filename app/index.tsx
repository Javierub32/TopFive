import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // El _layout se encarga de redirigir, aquí solo mostramos un loader
  // por si acaso hay un pequeño delay visual.
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
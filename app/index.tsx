import { Redirect } from 'expo-router';

export default function Index() {
  // Si el layout renderiza este componente, significa que no hubo redirección previa.
  // Por defecto, mandamos al usuario a la pestaña principal.
  return <Redirect href="/(tabs)/Home" />;
}
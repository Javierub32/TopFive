import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState } from 'react-native';

// Usa variables de entorno para mayor seguridad
// En Expo, las variables deben tener el prefijo EXPO_PUBLIC_ para ser accesibles
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validación para asegurar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Faltan las variables de entorno de Supabase. ' +
		'Asegúrate de tener un archivo .env con EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY'
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: Platform.OS === 'web' ? undefined : AsyncStorage, // En web usa localStorage por defecto
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: Platform.OS === 'web', // Necesario para web
	},
});

// (Opcional) Código para manejar refresco de tokens en React Native
if (Platform.OS !== 'web') {
	AppState.addEventListener('change', (state) => {
		if (state === 'active') {
			supabase.auth.startAutoRefresh();
		} else {
			supabase.auth.stopAutoRefresh();
		}
	});
}
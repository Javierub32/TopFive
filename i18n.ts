import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import es from './translations/es.json';
import en from './translations/en.json';

const LANGUAGE_KEY = 'user_language_preference';

// Configuramos los recursos
const resources = {
  es: { translation: es },
  en: { translation: en },
};

const initI18n = async () => {
  // 1. Miramos si el usuario ya eligió un idioma antes
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  // 2. Si no ha elegido nada, cogemos el idioma de su móvil
  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode;
  }

  // 3. Inicializamos i18next
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage || 'es', // Idioma por defecto
      fallbackLng: 'es', // Si falta una traducción en inglés, muestra español
      interpolation: {
        escapeValue: false, // React ya protege contra XSS
      },
    });
};

initI18n();

export default i18n;
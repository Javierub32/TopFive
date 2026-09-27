import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeLocale, DEFAULT_LOCALE } from 'lib/locale';

import es from './translations/es.json';
import en from './translations/en.json';
import enGB from './translations/en-GB.json';


const LANGUAGE_KEY = 'user_language_preference';

// Configuramos los recursos
const resources = {
  'es-ES': { translation: es },
  'en-US': { translation: en },
  'en-GB': { translation: enGB },
};

const initI18n = async () => {
  // 1. Miramos si el usuario ya eligió un idioma antes
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  const deviceLanguage = Localization.getLocales()[0].languageTag;

  const language = normalizeLocale(savedLanguage || deviceLanguage);


  // 3. Inicializamos i18next
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language, // Idioma por defecto
      fallbackLng: DEFAULT_LOCALE, // Idioma de respaldo
      interpolation: {
        escapeValue: false, // React ya protege contra XSS
      },
    });
};

initI18n();

export default i18n;
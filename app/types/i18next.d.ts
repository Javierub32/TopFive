import 'i18next';
// Importamos nuestro idioma base para que TypeScript lea su estructura
import es from '../../translations/es.json'; // <-- Ajusta esta ruta si es necesario

declare module 'i18next' {
  // Extendemos las opciones de i18next con nuestra estructura personalizada
  interface CustomTypeOptions {
    // Definimos el espacio de nombres por defecto (normalmente 'translation')
    defaultNS: 'translation';
    // Le decimos que los recursos tienen exactamente la forma de nuestro JSON en español
    resources: {
      translation: typeof es;
    };
  }
}
export type AppLocale = 'es-ES' | 'en-US' | 'en-GB';

export const DEFAULT_LOCALE: AppLocale = 'es-ES';

export function normalizeLocale(value?: string | null) {
  const locale = value?.replace('_', '-').toLowerCase();

  if (locale === 'en-gb' || locale?.startsWith('en-gb-')) {
    return 'en-GB';
  }

  if (locale?.startsWith('en')) {
    return 'en-US';
  }

  if (locale?.startsWith('es')) {
    return 'es-ES';
  }

  return DEFAULT_LOCALE;
}
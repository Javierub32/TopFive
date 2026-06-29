import { BookResource, SeriesResource, GameResource } from 'app/types/Resources';
import { TimerIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { View } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Props {
  resource: BookResource | SeriesResource | GameResource;
}

export const TimeCard = ({ resource }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getReadingDuration = () => {
    if (!resource?.fechaInicio) return null;

    const start = new Date(resource.fechaInicio);
    let end = new Date(); // Por defecto: hoy (para EN_CURSO)

    // Si está completado y tiene fecha fin, usamos esa
    if (resource.estado === 'COMPLETADO' && resource.fechaFin) {
      end = new Date(resource.fechaFin);
    }
    // Si está pendiente, no mostramos nada (o podrías retornar "0 días")
    else if (resource.estado === 'PENDIENTE') {
      return null;
    }

    // Normalizamos las horas para contar días naturales completos
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    // Convertimos milisegundos a días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t('details.zeroDays'); // Por si las fechas están al revés
    if (diffDays === 0) return t('details.oneDay'); // Mismo día cuenta como 1
    return t('details.days', { days: diffDays });
  };

  const readingTime = getReadingDuration();

  if (readingTime)
    return (
      <View className="mt-4">
        <View
          className="flex-row items-center justify-between rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: `${colors.accent}BF` }}>
          <View>
            <AppText
              className="mb-1 font-medium uppercase tracking-widest"
              style={{ color: colors.primaryText, fontSize: 14 }}>
              {t('details.totalReadingTime')}
            </AppText>
            <AppText className="text-2xl font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
              {readingTime}
            </AppText>
          </View>
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${colors.primaryText}33` }}>
            <TimerIcon />
          </View>
        </View>
      </View>
    );
};

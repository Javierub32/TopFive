import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from 'components/Icons';
import { useState } from 'react';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { SeriesResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ReturnButton } from 'components/ReturnButton';
import { FavoriteSetter } from '@/Form/components/FavoriteSetter';
import { ReviewSetter } from '@/Form/components/ReviewSetter';
import { StateSetter } from '@/Form/components/StateSetter';
import { RatingSetter } from '@/Form/components/RatingSetter';
import { ViewsSetter } from '@/Form/components/ViewsSetter';
import { DateSetter } from '@/Form/components/DateSetter';
import { ProgressSetter } from '@/Form/components/ProgressSetter';
import { useNotification } from 'context/NotificationContext';
import { AdBanner } from 'components/AdBanner';
import { FallbackCover } from 'components/FallbackCover';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function SeriesForm() {
  const { seriesData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();

  const { colors } = useTheme();
  const { t } = useTranslation();

  const isEditing = !!item;
  const resource = isEditing ? JSON.parse(item as string) : null;
  const series: any = isEditing ? resource.contenido : JSON.parse(seriesData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(
    resource?.estado || 'PENDIENTE'
  );

  // Campos específicos de series
  const [temporadaActual, setTemporadaActual] = useState(
    resource?.temporadaActual?.toString() || '1'
  );
  const [episodioActual, setEpisodioActual] = useState(resource?.episodioActual?.toString() || '1');
  const [numVisualizaciones, setNumVisualizaciones] = useState(resource?.numVisualizaciones || 0);

  // Fechas
  const [fechaInicio, setFechaInicio] = useState<Date | null>(
    resource?.fechaInicio ? new Date(resource.fechaInicio) : null
  );
  const [fechaFin, setFechaFin] = useState<Date | null>(
    resource?.fechaFin ? new Date(resource.fechaFin) : null
  );

  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const handleStatusChange = (nuevoEstado: any) => {
    setEstado(nuevoEstado);
    if (nuevoEstado === 'COMPLETADO' && !fechaFin) {
      setFechaFin(new Date());
    }
  };

  const estadoAnterior = resource?.estado;

  const handleSubmit = async () => {
    // Validaciones básicas de números
    const tempNum = parseInt(temporadaActual) || 1;
    const epNum = parseInt(episodioActual) || 1;

    setLoading(true);
    try {
      if (isEditing) {
        // Modo edición: actualizar el recurso existente
        const { data: updatedData, error: updateError } = await supabase
          .from('recursoserie')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            temporadaActual: tempNum,
            episodioActual: epNum,
            numVisualizaciones: numVisualizaciones,
            fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
            fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
          })
          .eq('id', resource.id)
          .select(
            `
            *,
            contenidoserie:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          `
          )
          .single();

        if (updateError) {
          //Alert.alert('Error', 'Hubo un problema al actualizar la serie. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.updatingError'),
            description: t('forms.serie.updatingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al actualizar:', updateError);
        } else {
          // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidoserie;
          delete rawData.contenidoserie;
          const seriesResource: SeriesResource = {
            ...rawData,
            contenido: contentData,
          };

          //Alert.alert('¡Éxito!', `Has actualizado ${series.titulo || series.title} en tu colección.`);
          refreshData();
          if (estadoAnterior !== 'COMPLETADO' && estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          } else if (estadoAnterior === 'COMPLETADO' && estado !== 'COMPLETADO') {
            await supabase.rpc('decrement_review_count', { user_id: user.id });
          }
          router.replace({
            pathname: '/details/series/seriesResource',
            params: {
              item: JSON.stringify(seriesResource),
              from: from,
            },
          });
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: series.titulo || series.title,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      } else {
        // Modo creación: insertar nuevo recurso
        // 1. Verificar si el contenido existe en 'contenidoserie'
        const { data: existingContent, error: searchError } = await supabase
          .from('contenidoserie')
          .select('id')
          .eq('idApi', series.id)
          .eq('titulo', series.title)
          .maybeSingle();

        if (searchError) throw searchError;

        let contentId;

        if (existingContent) {
          contentId = existingContent.id;
        } else {
          // 2. Si no existe, crearlo
          const { data: newContent, error: insertError } = await supabase
            .from('contenidoserie')
            .insert({
              titulo: series.title,
              idApi: series.id,
              imagenUrl: series.imageFull || series.image,
              fechaLanzamiento: series.releaseDate,
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          contentId = newContent.id;
        }

        // 3. Verificar si el usuario ya tiene este recurso
        const { data: resource, error: checkError } = await supabase
          .from('recursoserie')
          .select('id')
          .eq('idContenido', contentId)
          .eq('usuarioId', user.id)
          .maybeSingle();

        if (checkError) throw checkError;

        if (resource) {
          //Alert.alert('Aviso', 'Ya tienes esta serie en tu colección.');
          refreshData();
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.warning'),
              description: t('forms.serie.alreadyInCollection'),
              isChoice: false,
              delete: false,
              success: false,
            });
          }, 100);
          setLoading(false);
          return;
        }

        // 4. Insertar el recurso del usuario en 'recursoserie'
        const { error: inventoryError } = await supabase.from('recursoserie').insert({
          usuarioId: user.id,
          idContenido: contentId,
          estado: estado,
          reseña: reseña,
          calificacion: calificacionPersonal,
          favorito: favorita,
          temporadaActual: tempNum,
          episodioActual: epNum,
          numVisualizaciones: numVisualizaciones,
          fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
          fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
        });

        if (inventoryError) {
          //Alert.alert('Error', 'Hubo un problema al guardar la serie. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.serie.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          //Alert.alert('¡Éxito!', `Has añadido ${series.title} a tu colección.`);
          refreshData();
          if (estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          }
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription'),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving series data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!series) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            {t('details.loadingError.series')}
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 flex-row items-center justify-between px-4 pb-4 pt-2">
            <View className="flex-1 flex-row items-center">
              <ReturnButton route="back" title={series.titulo || series.title} style={' '} />
            </View>
            <FavoriteSetter favorite={favorita} setFavorite={setFavorita} />
          </View>

          <View className="mb-4 flex-1 flex-row items-stretch justify-between gap-2 px-4">
            {series.imagenUrl || series.image ? (
              <Image
                source={{
                  uri: series.imagenUrl || series.image,
                }}
                className="aspect-[2/3] h-32 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}
                resizeMode="cover"
              />
            ) : (
              <FallbackCover
                type="serie"
                fullSize={false}
                style={{ aspectRatio: 2 / 3, borderRadius: 8 }}
              />
            )}

            <ReviewSetter review={reseña} setReview={setReseña} />
          </View>

          <View className="flex-1 gap-6">
            <StateSetter
              state={estado}
              setState={handleStatusChange}
              inProgressLabel={t('status.watching')}
            />
            <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />
            <ProgressSetter
              progress={temporadaActual}
              setProgress={setTemporadaActual}
              progressExtra={episodioActual}
              setProgressExtra={setEpisodioActual}
              type="serie"
            />
            <ViewsSetter views={numVisualizaciones} setViews={setNumVisualizaciones} />
            <DateSetter
              startDate={fechaInicio}
              setStartDate={setFechaInicio}
              endDate={fechaFin}
              setEndDate={setFechaFin}
              isRange={true}
            />
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="mx-4 mt-4 rounded-lg py-3"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}>
            <AppText className="text-center text-lg font-bold" style={{ color: colors.background }}>
              {loading ? t('common.saving') : t('common.save')}
            </AppText>
          </TouchableOpacity>
          <View className="flex-1">
            <AdBanner />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

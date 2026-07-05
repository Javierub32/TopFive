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
import { useState } from 'react';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { FilmResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ReturnButton } from 'components/ReturnButton';
import { FavoriteSetter } from '@/Form/components/FavoriteSetter';
import { ReviewSetter } from '@/Form/components/ReviewSetter';
import { StateSetter } from '@/Form/components/StateSetter';
import { RatingSetter } from '@/Form/components/RatingSetter';
import { DateSetter } from '@/Form/components/DateSetter';
import { ViewsSetter } from '@/Form/components/ViewsSetter';
import { useNotification } from 'context/NotificationContext';
import { AdBanner } from 'components/AdBanner';
import { MaterialCommunityIcons } from 'components/Icons';
import { FallbackCover } from 'components/FallbackCover';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function FilmForm() {
  const { filmData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();

  const { colors } = useTheme();
  const { t } = useTranslation();

  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const film: any = editando ? resource.contenido : JSON.parse(filmData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(
    resource?.estado || 'PENDIENTE'
  );
  const [fechaVisionado, setFechaVisionado] = useState<Date | null>(
    resource?.fechaVisionado ? new Date(resource.fechaVisionado) : null
  );
  const [numVisionados, setNumVisionados] = useState(resource?.numVisionados || 0);

  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const handleStatusChange = (nuevoEstado: any) => {
    setEstado(nuevoEstado);
    if (nuevoEstado === 'COMPLETADO' && !fechaVisionado) {
      setFechaVisionado(new Date());
    }
  };

  const estadoAnterior = resource?.estado;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editando) {
        // Actualizar el recurso existente
        const { data: updatedData, error: updateError } = await supabase
          .from('recursopelicula')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            fechaVisionado: fechaVisionado ? fechaVisionado.toISOString().split('T')[0] : null,
            numVisionados: numVisionados,
          })
          .eq('id', resource.id)
          .select(
            `
            *,
            contenidopelicula:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          `
          )
          .single();

        if (updateError) {
          showNotification({
            title: t('forms.updatingError'),
            description: t('forms.film.updatingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al actualizar:', updateError);
        } else {
          // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidopelicula;
          delete rawData.contenidopelicula;
          const filmResource: FilmResource = {
            ...rawData,
            contenido: contentData,
          };

          refreshData();
          if (estadoAnterior !== 'COMPLETADO' && estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          } else if (estadoAnterior === 'COMPLETADO' && estado !== 'COMPLETADO') {
            await supabase.rpc('decrement_review_count', { user_id: user.id });
          }
          if (from === 'contentDetails') {
            router.back();
          } else {
            router.replace({
              pathname: '/details/film/filmResource',
              params: {
                item: JSON.stringify(filmResource),
                from: from,
              },
            });
          }

          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: film.title || film.titulo,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      } else {
        // Insertar nuevo recurso
        // Miramos si el contenido ya existe en la tabla contenidopelicula
        const { data: existingContent, error: searchError } = await supabase
          .from('contenidopelicula')
          .select('id')
          .eq('idApi', film.id)
          .eq('titulo', film.title)
          .maybeSingle();

        if (searchError) {
          throw searchError;
        }
        let contentId;

        if (existingContent) {
          contentId = existingContent.id;
        } else {
          // Si no existe, lo creamos
          const { data: newContent, error: insertError } = await supabase
            .from('contenidopelicula')
            .insert({
              titulo: film.title,
              idApi: film.id,
              imagenUrl: film.image,
              fechaLanzamiento: film.releaseDate,
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          contentId = newContent.id;
        }

        // Verificar si el usuario ya tiene este recurso
        const { data: existingResource, error: checkError } = await supabase
          .from('recursopelicula')
          .select('id')
          .eq('idContenido', contentId)
          .eq('usuarioId', user.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (existingResource) {
          //Alert.alert("Aviso", "Ya tienes esta película en tu colección.");
          refreshData();
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.warning'),
              description: t('forms.film.alreadyInCollection'),
              isChoice: false,
              delete: false,
              success: false,
            });
          }, 100);
          setLoading(false);
          return;
        }

        // Ahora insertamos el recurso del usuario
        const { error: inventoryError } = await supabase.from('recursopelicula').insert({
          usuarioId: user.id,
          idContenido: contentId,
          estado: estado,
          reseña: reseña,
          calificacion: calificacionPersonal,
          favorito: favorita,
          fechaVisionado: fechaVisionado ? fechaVisionado.toISOString().split('T')[0] : null,
          numVisionados: numVisionados,
        });

        if (inventoryError) {
          //Alert.alert("Error", "Hubo un problema al guardar la película. Inténtalo de nuevo.");
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.film.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          //Alert.alert("¡Éxito!", `Has añadido a ${film.title} a tu colección.`);
          refreshData();
          if (estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          }
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: film.title || film.titulo,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving film data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!film) {
    console.log(item);
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 font-bold" style={{ color: colors.primaryText, fontSize: 20 }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText
            className="mt-2 text-center"
            style={{ color: colors.secondaryText, fontSize: 16 }}>
            {t('details.loadingError.films')}
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
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
            <View className="flex-1 flex-row items-center">
              <ReturnButton route="back" title={film.titulo || film.title} style={' '} />
            </View>
            <FavoriteSetter favorite={favorita} setFavorite={setFavorita} />
          </View>

          <View className="mb-4 flex-row items-stretch justify-between gap-2 px-4">
            {film.imagenUrl || film.image ? (
              <Image
                source={{
                  uri: film.imagenUrl || film.image || 'https://via.placeholder.com/100x150',
                }}
                className="aspect-[2/3] h-32 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}
                resizeMode="cover"
              />
            ) : (
              <FallbackCover
                type="pelicula"
                fullSize={false}
                style={{ aspectRatio: 2 / 3, borderRadius: 8 }}
              />
            )}

            <ReviewSetter review={reseña} setReview={setReseña} />
          </View>

          <View className="gap-6">
            <StateSetter
              state={estado}
              setState={handleStatusChange}
              inProgressLabel={t('status.watching')}
            />
            <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />

            <View className="mr-4 flex-row items-start">
              <View className="flex-1">
                <ViewsSetter views={numVisionados} setViews={setNumVisionados} />
              </View>
              <View className="flex-1">
                <DateSetter
                  startDate={fechaVisionado}
                  setStartDate={setFechaVisionado}
                  isRange={false}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="mx-4 mb-14 mt-4 rounded-lg py-3"
            style={{ backgroundColor: colors.primary }}
            activeOpacity={0.8}>
            <AppText
              className="text-center font-bold"
              style={{ color: colors.background, fontSize: 18 }}>
              {loading ? t('common.saving') : t('common.save')}
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <AdBanner />
    </Screen>
  );
}

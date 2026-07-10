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
import { SongResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ReturnButton } from 'components/ReturnButton';
import { FavoriteSetter } from '@/Form/components/FavoriteSetter';
import { ReviewSetter } from '@/Form/components/ReviewSetter';
import { StateSetter } from '@/Form/components/StateSetter';
import { RatingSetter } from '@/Form/components/RatingSetter';
import { DateSetter } from '@/Form/components/DateSetter';
import { useNotification } from 'context/NotificationContext';
import { AdBanner } from 'components/AdBanner';
import { FallbackCover } from 'components/FallbackCover';
import { MaterialCommunityIcons } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function SongForm() {
  const { songData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();

  const { colors } = useTheme();
  const { t } = useTranslation();

  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const song: any = editando ? resource.contenido : JSON.parse(songData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  const [fechaEscuchado, setFechaEscuchado] = useState<Date | null>(
    resource?.fechaEscucha ? new Date(resource.fechaEscucha) : null
  );

  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const handleStatusChange = (nuevoEstado: any) => {
    setEstado(nuevoEstado);
    if (nuevoEstado === 'COMPLETADO' && !fechaEscuchado) {
      setFechaEscuchado(new Date());
    }
  };

  const estadoAnterior = resource?.estado;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editando) {
        // Modo edición: actualizar el recurso existente
        const { data: updatedData, error: updateError } = await supabase
          .from('recursocancion')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            fechaEscucha: fechaEscuchado ? fechaEscuchado.toISOString().split('T')[0] : null,
          })
          .eq('id', resource.id)
          .select(
            `
            *,
            contenidocancion:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          `
          )
          .single();

        if (updateError) {
          //Alert.alert('Error', 'Hubo un problema al actualizar la canción. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.updatingError'),
            description: t('forms.albums.updatingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al actualizar:', updateError);
        } else {
          // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidocancion;
          delete rawData.contenidocancion;
          const songResource: SongResource = {
            ...rawData,
            contenido: contentData,
          };

          //Alert.alert('¡Éxito!', `Has actualizado ${song.titulo || song.title} en tu colección.`);
          if (estadoAnterior !== 'COMPLETADO' && estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          } else if (estadoAnterior === 'COMPLETADO' && estado !== 'COMPLETADO') {
            await supabase.rpc('decrement_review_count', { user_id: user.id });
          }
          refreshData('cancion');

          if (from === 'contentDetails') {
            router.back();
          } else {
            router.replace({
              pathname: '/details/song/songResource',
              params: {
                item: JSON.stringify(songResource),
                from: from,
              },
            });
          }
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: song.titulo || song.title,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      } else {
        // Modo creación: insertar nuevo recurso
        // Miramos si el contenido ya existe en la tabla contenidocancion
        const { data: existingContent, error: searchError } = await supabase
          .from('contenidocancion')
          .select('id')
          .eq('idApi', song.id)
          .eq('titulo', song.title)
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
            .from('contenidocancion')
            .insert({
              titulo: song.title,
              idApi: song.id,
              imagenUrl: song.imageFull || song.image,
              fechaLanzamiento: song.releaseDate,
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          contentId = newContent.id;
        }

        // Verificar si el usuario ya tiene este recurso
        const { data: resource, error: checkError } = await supabase
          .from('recursocancion')
          .select('id')
          .eq('idContenido', contentId)
          .eq('usuarioId', user.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (resource) {
          //Alert.alert('Aviso', 'Ya tienes esta canción en tu colección.');
          refreshData('cancion');
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.warning'),
              description: t('forms.albums.alreadyInCollection'),
              isChoice: false,
              delete: false,
              success: false,
            });
          }, 100);
          setLoading(false);
          return;
        }

        // Ahora insertamos el recurso del usuario
        const { error: inventoryError } = await supabase.from('recursocancion').insert({
          usuarioId: user.id,
          idContenido: contentId,
          estado: estado,
          reseña: reseña,
          calificacion: calificacionPersonal,
          favorito: favorita,
          fechaEscucha: fechaEscuchado ? fechaEscuchado.toISOString().split('T')[0] : null,
          albumId: song.albumId,
        });

        if (inventoryError) {
          //Alert.alert('Error', 'Hubo un problema al guardar la canción. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.albums.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          //Alert.alert('¡Éxito!', `Has añadido ${song.title} a tu colección.`);
          if (estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          }
          refreshData('cancion');
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: song.titulo || song.title,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving song data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!song) {
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
            {t('details.loadingError.albums')}
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
          <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
            <View className="flex-1 flex-row items-center">
              <ReturnButton route="back" title={song.titulo || song.title} style={' '} />
            </View>
            <FavoriteSetter favorite={favorita} setFavorite={setFavorita} />
          </View>
          <View className="mb-4 flex-row items-stretch justify-between gap-2 px-4">
            {song.imagenUrl || song.image ? (
              <Image
                source={{ uri: song.imagenUrl || song.image || '' }}
                className="aspect-square h-32 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}
                resizeMode="cover"
              />
            ) : (
              <FallbackCover
                type="cancion"
                fullSize={false}
                style={{ aspectRatio: 1, borderRadius: 8 }}
              />
            )}

            <ReviewSetter review={reseña} setReview={setReseña} />
          </View>

          <View className="gap-6">
            <StateSetter state={estado} setState={handleStatusChange} />
            <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />
            <DateSetter
              startDate={fechaEscuchado}
              setStartDate={setFechaEscuchado}
              isRange={false}
              style="mx-10"
            />
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

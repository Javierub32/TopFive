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
import { BookResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { ReturnButton } from 'components/ReturnButton';
import { FavoriteSetter } from '@/Form/components/FavoriteSetter';
import { ReviewSetter } from '@/Form/components/ReviewSetter';
import { StateSetter } from '@/Form/components/StateSetter';
import { RatingSetter } from '@/Form/components/RatingSetter';
import { ProgressSetter } from '@/Form/components/ProgressSetter';
import { DateSetter } from '@/Form/components/DateSetter';
import { useNotification } from 'context/NotificationContext';
import { AdBanner } from 'components/AdBanner';
import { FallbackCover } from 'components/FallbackCover';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

interface Book {
  id: number | null;
  title: string | null;
  autor: string | null;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  reference: string | null;
  autorId: number | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
  imagenUrl?: string | null;
}

export default function BookForm() {
  const { bookData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();
  const { colors } = useTheme();
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  // Si es item, se edita, si no, es nuevo
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const book: Book = editando ? resource.contenido : JSON.parse(bookData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorito, setFavorito] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(
    resource?.estado || 'PENDIENTE'
  );
  const [paginasLeidas, setPaginasLeidas] = useState(resource?.paginasLeidas?.toString() || '');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(
    resource?.fechaInicio ? new Date(resource.fechaInicio) : null
  );
  const [fechaFin, setFechaFin] = useState<Date | null>(
    resource?.fechaFin ? new Date(resource.fechaFin) : null
  );

  const [loading, setLoading] = useState(false);

  const handleStatusChange = (nuevoEstado: any) => {
    setEstado(nuevoEstado);
    if (nuevoEstado === 'COMPLETADO' && !fechaFin) {
      setFechaFin(new Date());
    }
  };

  const estadoAnterior = resource?.estado;

  const handleSubmit = async () => {
    const numPaginas = parseInt(paginasLeidas) || 0;
    if (numPaginas > 3031) {
      showNotification({
        title: t('forms.book.invalidPages'),
        description: t('forms.book.invalidPagesDescription'),
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    setLoading(true);
    try {
      if (editando) {
        // Si se está editando, actualizar el recurso existente
        const { data: updatedData, error: updateError } = await supabase
          .from('recursolibro')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorito,
            paginasLeidas: numPaginas,
            fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
            fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
          })
          .eq('id', resource.id)
          .select(
            `
            *,
            contenidolibro:idContenido (
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
            description: t('forms.book.updatingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al actualizar:', updateError);
        } else {
          // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidolibro;
          delete rawData.contenidolibro;
          const bookResource: BookResource = {
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
              pathname: '/details/book/bookResource',
              params: {
                item: JSON.stringify(bookResource),
                from: from,
              },
            });
          }
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: book.title || t('forms.book.thisBook'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      } else {
        // Si es un nuevo contenido,insertar nuevo recurso
        // Miramos si el contenido ya existe en la tabla contenidolibro
        const { data: existingContent, error: searchError } = await supabase
          .from('contenidolibro')
          .select('id')
          .eq('idApi', book.id)
          .eq('titulo', book.title)
          .maybeSingle();

        if (searchError) {
          throw searchError;
        }
        let contentId;

        if (existingContent) {
          contentId = existingContent.id;
          const imagenReparada = book.imageFull || book.image || book.imagenUrl;
          if (imagenReparada) {
            await supabase
              .from('contenidolibro')
              .update({ imagenUrl: imagenReparada })
              .eq('id', contentId);
          }
        } else {
          // Si no existe, lo creamos
          const { data: newContent, error: insertError } = await supabase
            .from('contenidolibro')
            .insert({
              titulo: book.title,
              idApi: book.id,
              imagenUrl: book.imageFull || book.image,
              fechaLanzamiento: book.releaseDate,
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          contentId = newContent.id;
        }

        // Verificar si el usuario ya tiene este recurso
        const { data: resource, error: checkError } = await supabase
          .from('recursolibro')
          .select('id')
          .eq('idContenido', contentId)
          .eq('usuarioId', user.id)
          .maybeSingle();

        if (checkError) {
          throw checkError;
        }

        if (resource) {
          refreshData();
          router.back();
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: t('common.warning'),
              description: t('forms.book.alreadyInCollection'),
              isChoice: false,
              delete: false,
              success: false,
            });
          }, 100);
          setLoading(false);
          return;
        }

        // Ahora insertamos el recurso del usuario
        const numPaginas = parseInt(paginasLeidas) || 0;
        const { error: inventoryError } = await supabase.from('recursolibro').insert({
          usuarioId: user.id,
          idContenido: contentId,
          estado: estado,
          reseña: reseña,
          calificacion: calificacionPersonal,
          favorito: favorito,
          tiporecurso: 'LIBRO',
          paginasLeidas: numPaginas,
          fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
          fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
        });

        if (inventoryError) {
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.book.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData();
          if (estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          }
          router.back();
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: book.title || t('forms.book.theBook'),
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving book data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
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
            {t('details.loadingError.books')}
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
              <ReturnButton
                route="back"
                title={book.title || t('forms.book.bookDetails')}
                style={' '}
              />
            </View>
            <FavoriteSetter favorite={favorito} setFavorite={setFavorito} />
          </View>

          <View className="mb-4 flex-row items-stretch justify-between gap-2 px-4">
            {book.imageFull || book.image || book.imagenUrl ? (
              <Image
                source={{ uri: book.imageFull || book.image || book.imagenUrl || '' }}
                className="aspect-[2/3] h-32 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}
                resizeMode="cover"
              />
            ) : (
              <FallbackCover
                type="libro"
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
              inProgressLabel={t('status.reading')}
            />
            <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />

            {estado !== 'COMPLETADO' && (
              <ProgressSetter
                progress={paginasLeidas}
                setProgress={setPaginasLeidas}
                type="libro"
              />
            )}

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

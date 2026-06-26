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
import { GameResource } from 'app/types/Resources';
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
import { DifficultySetter } from '@/Form/components/DifficultySetter';
import { useNotification } from 'context/NotificationContext';
import { AdBanner } from 'components/AdBanner';
import { FallbackCover } from 'components/FallbackCover';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function GameForm() {
  const { gameData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();
  const { showNotification } = useNotification();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const game: any = editando ? resource.contenido : JSON.parse(gameData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorito, setFavorito] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ABANDONADO'>(
    resource?.estado || 'PENDIENTE'
  );

  // Campos específicos de videojuegos
  const [horasJugadas, setHorasJugadas] = useState(resource?.horasJugadas?.toString() || '');
  const [dificultad, setDificultad] = useState<string>(resource?.dificultad || 'Normal');

  // Fechas
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
    const horasNum = parseFloat(horasJugadas) || 0;

    setLoading(true);
    try {
      if (editando) {
        // Actualizar el recurso existente
        const { data: updatedData, error: updateError } = await supabase
          .from('recursovideojuego')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorito,
            horasJugadas: horasNum,
            dificultad: dificultad,
            fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
            fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
          })
          .eq('id', resource.id)
          .select(
            `
            *,
            contenidovideojuego:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento              
            )
          `
          )
          .single();

        if (updateError) {
          //Alert.alert('Error', 'Hubo un problema al actualizar el videojuego. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.updatingError'),
            description: t('forms.game.updatingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al actualizar:', updateError);
        } else {
          // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidovideojuego;
          delete rawData.contenidovideojuego;
          const gameResource: GameResource = {
            ...rawData,
            contenido: contentData,
          };

          //Alert.alert('¡Éxito!', `Has actualizado ${game.titulo || game.title} en tu colección.`);
          refreshData();
          if (estadoAnterior !== 'COMPLETADO' && estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          } else if (estadoAnterior === 'COMPLETADO' && estado !== 'COMPLETADO') {
            await supabase.rpc('decrement_review_count', { user_id: user.id });
          }
          router.replace({
            pathname: '/details/game/gameResource',
            params: {
              item: JSON.stringify(gameResource),
              from: from,
            },
          });
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.updatingSuccessDescription', {
                titulo: game.titulo || game.title,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      } else {
        // Insertar nuevo recurso
        // 1. Verificar si el contenido existe en 'contenidovideojuego'
        const { data: existingContent, error: searchError } = await supabase
          .from('contenidovideojuego')
          .select('id')
          .eq('idApi', game.id)
          .eq('titulo', game.title)
          .maybeSingle();

        if (searchError) throw searchError;

        let contentId;

        if (existingContent) {
          contentId = existingContent.id;
        } else {
          // 2. Si no existe, crearlo
          const { data: newContent, error: insertError } = await supabase
            .from('contenidovideojuego')
            .insert({
              titulo: game.title,
              idApi: game.id,
              imagenUrl: game.imageFull || game.image,
              fechaLanzamiento: game.releaseDate,
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          contentId = newContent.id;
        }

        // 3. Verificar si el usuario ya tiene este recurso
        const { data: existingResource, error: checkError } = await supabase
          .from('recursovideojuego')
          .select('id')
          .eq('idContenido', contentId)
          .eq('usuarioId', user.id)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingResource) {
          //Alert.alert('Aviso', 'Ya tienes este videojuego en tu colección.');
          refreshData();
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.warning'),
              description: t('forms.game.alreadyInCollection'),
              isChoice: false,
              delete: false,
              success: false,
            });
          }, 100);
          setLoading(false);
          return;
        }

        // 4. Insertar el recurso del usuario en 'recursovideojuego'
        const { error: inventoryError } = await supabase.from('recursovideojuego').insert({
          usuarioId: user.id,
          idContenido: contentId,
          estado: estado,
          reseña: reseña,
          calificacion: calificacionPersonal,
          favorito: favorito,
          horasJugadas: horasNum,
          dificultad: dificultad,
          fechaInicio: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
          fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
        });

        if (inventoryError) {
          //Alert.alert('Error', 'Hubo un problema al guardar el videojuego. Inténtalo de nuevo.');
          showNotification({
            title: t('forms.savingError'),
            description: t('forms.game.savingErrorDescription'),
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          //Alert.alert('¡Éxito!', `Has añadido ${game.title} a tu colección.`);
          refreshData();
          if (estado === 'COMPLETADO') {
            await supabase.rpc('increment_review_count', { user_id: user.id });
          }
          router.back();
          setTimeout(() => {
            showNotification({
              title: t('common.success'),
              description: t('forms.savingSuccessDescription', {
                titulo: game.titulo || game.title,
              }),
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving game data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            {t('details.loadingError.videogames')}
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
              <ReturnButton route="back" title={game.titulo || game.title} style={' '} />
            </View>
            <FavoriteSetter favorite={favorito} setFavorite={setFavorito} />
          </View>

          <View className="mb-4 flex-row items-stretch justify-between gap-2 px-4">
            {game.imagenUrl || game.image ? (
              <Image
                source={{
                  uri: game.imagenUrl || game.image || '',
                }}
                className="aspect-[2/3] h-32 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}
                resizeMode="cover"
              />
            ) : (
              <FallbackCover
                type="videojuego"
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
              inProgressLabel={t('status.playing')}
            />
            <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />
            <DifficultySetter difficulty={dificultad} setDifficulty={setDificultad} />
            <ProgressSetter
              progress={horasJugadas}
              setProgress={setHorasJugadas}
              type="videojuego"
            />

            <DateSetter
              startDate={fechaInicio}
              setStartDate={setFechaInicio}
              endDate={fechaFin}
              setEndDate={setFechaFin}
              isRange={true}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="mx-4 mb-14 rounded-lg py-3"
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.8}>
              <AppText
                className="text-center text-lg font-bold"
                style={{ color: colors.background }}>
                {loading ? t('common.saving') : t('common.save')}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AdBanner />
    </Screen>
  );
}

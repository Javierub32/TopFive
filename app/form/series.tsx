import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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
interface Series {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  imageFull: string | null;
  description: string | null;
  rating: number | null;
  ended: string | null;
}

export default function SeriesForm() {
  const { seriesData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();

  const { colors } = useTheme();

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
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);

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
            title: 'Error al actualizar',
            description: 'Hubo un problema al actualizar la serie. Inténtalo de nuevo.',
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
          if(estadoAnterior != 'COMPLETADO' && estado === 'COMPLETADO'){
            await supabase.rpc('increment_review_count', {user_id: user.id})
          } else if (estadoAnterior === 'COMPLETADO' && estado != 'COMPLETADO') {
            await supabase.rpc('decrement_review_count', {user_id: user.id})
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
              title: '¡Éxito!',
              description: `Has actualizado ${series.titulo || series.title} en tu colección.`,
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
              title: 'Aviso',
              description: 'Ya tienes esta serie en tu colección.',
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
            title: 'Error al guardar',
            description: 'Hubo un problema al guardar la serie. Inténtalo de nuevo.',
            isChoice: false,
            delete: false,
            success: false,
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          //Alert.alert('¡Éxito!', `Has añadido ${series.title} a tu colección.`);
          refreshData();
          if(estado === 'COMPLETADO'){
            await supabase.rpc('increment_review_count', {user_id: user.id})
          }
          router.back();
          setTimeout(() => {
            showNotification({
              title: '¡Éxito!',
              description: `Has añadido ${series.title} a tu colección.`,
              isChoice: false,
              delete: false,
              success: true,
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving series data:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!series) {
    return (
      <Screen>
        <ThemedStatusBar />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información de la serie
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton route="back" title={series.titulo || series.title} style={' '} />
          </View>
          <FavoriteSetter favorite={favorita} setFavorite={setFavorita} />
        </View>

        <View className="mb-4 flex-row items-stretch justify-between gap-2 px-4">
          <Image
            source={{
              uri: series.imagenUrl || series.image || 'https://via.placeholder.com/100x150',
            }}
            className="aspect-[2/3] h-32 rounded-lg"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
          <ReviewSetter review={reseña} setReview={setReseña} />
        </View>

        <View className="gap-6">
          <StateSetter state={estado} setState={handleStatusChange} inProgressLabel="Viendo" />
          <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal} />
          {estado !== 'COMPLETADO' && (
            <ProgressSetter
              progress={temporadaActual}
              setProgress={setTemporadaActual}
              progressExtra={episodioActual}
              setProgressExtra={setEpisodioActual}
              type="serie"
            />
          )}
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
          className="mx-4 mb-14 mt-4 rounded-lg py-3"
          style={{ backgroundColor: colors.primary }}
          activeOpacity={0.8}>
          <Text className="text-center text-lg font-bold" style={{ color: colors.background }}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <AdBanner />
    </Screen>
  );
}

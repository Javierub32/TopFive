import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { COLORS } from 'constants/colors';
import { SeriesResource } from 'app/types/Resources';

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
  const { seriesData, item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const isEditing = !!item;
  const resource = isEditing ? JSON.parse(item as string) : null;
  const series: any = isEditing ? resource.contenidoserie : JSON.parse(seriesData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  
  // Campos específicos de series
  const [temporadaActual, setTemporadaActual] = useState(resource?.temporadaActual?.toString() || '1');
  const [episodioActual, setEpisodioActual] = useState(resource?.episodioActual?.toString() || '1');
  const [numVisualizaciones, setNumVisualizaciones] = useState(resource?.numVisualizaciones || 0);
  
  // Fechas
  const [fechaInicio, setFechaInicio] = useState<Date | null>(resource?.fechaInicio ? new Date(resource.fechaInicio) : null);
  const [fechaFin, setFechaFin] = useState<Date | null>(resource?.fechaFin ? new Date(resource.fechaFin) : null);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validaciones básicas de números
    const tempNum = parseInt(temporadaActual) || 1;
    const epNum = parseInt(episodioActual) || 1;

    setLoading(true);
    try {
      if (isEditing) {
        // Modo edición: actualizar el recurso existente
        const { data: updateData, error: updateError } = await supabase
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
          .select(`
            *,
            contenidoserie:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento,
              fechaFin            
            )
          `)
          .single();

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar la serie. Inténtalo de nuevo.');
          console.error('Error al actualizar:', updateError);
        } else {
          const seriesResource: SeriesResource = updateData;
          Alert.alert('¡Éxito!', `Has actualizado ${series.titulo || series.title} en tu colección.`);
          router.replace({
            pathname: '/details/series/seriesResource',
            params: { 
              item: JSON.stringify(seriesResource)
            }
          });
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
            fechaFin: series.ended,
            descripcion: series.description,
            calificacion: series.rating,
            genero: series.genre,
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
        Alert.alert('Aviso', 'Ya tienes esta serie en tu colección.');
        router.back();
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
        Alert.alert('Error', 'Hubo un problema al guardar la serie. Inténtalo de nuevo.');
        console.error('Error al insertar:', inventoryError);
      } else {
        Alert.alert('¡Éxito!', `Has añadido ${series.title} a tu colección.`);
        router.back();
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
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la serie
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header Volver */}
        <TouchableOpacity
          onPress={handleBack}
          className="mb-4 flex-row items-center"
          activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          <Text className="ml-2 text-lg text-primaryText">Volver</Text>
        </TouchableOpacity>

        {/* Tarjeta de Resumen */}
        <View className="mb-6 flex-row items-center rounded-xl border border-borderButton/50 bg-surfaceButton/50 px-4 py-4">
          <Image
            source={{ uri: series.imagenUrl || series.imageFull || series.image || 'https://via.placeholder.com/100x150' }}
            className="mr-4 h-24 w-16 rounded-lg border border-borderButton bg-surfaceButton"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-primaryText" numberOfLines={2}>
              {series.titulo || series.title}
            </Text>
            <Text className="mt-1 text-secondaryText">
               {series.fechaLanzamiento || series.releaseDate ? new Date(series.fechaLanzamiento || series.releaseDate).getFullYear() : 'N/A'} 
               {series.fechaFin || series.ended ? ` - ${new Date(series.fechaFin || series.ended).getFullYear()}` : ' - Presente'}
            </Text>
            {/* Dato extra añadido: Género */}
            {(series.genero || series.genre) && (series.genero || series.genre).length > 0 && (
              <Text className="mt-1 text-sm text-secondaryText" numberOfLines={1}>
                {(series.genero || series.genre).slice(0, 3).join(', ')}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setFavorita(!favorita)} className="p-2">
            <MaterialCommunityIcons
              name={favorita ? 'heart' : 'heart-outline'}
              size={32}
              color={favorita ? '#ef4444' : '#94a3b8'}
            />
          </TouchableOpacity>
        </View>

        <View className="gap-6">
          {/* Selector de Estado */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Estado</Text>
            <View className="flex-row gap-2">
              {(['PENDIENTE', 'EN_CURSO', 'COMPLETADO'] as const).map((est) => (
                <TouchableOpacity
                  key={est}
                  onPress={() => setEstado(est)}
                  className={`flex-1 rounded-lg border py-3 ${
                    estado === est
                      ? 'border-primary bg-marker'
                      : 'border-borderButton bg-surfaceButton'
                  }`}>
                  <Text
                    className={`text-center text-sm ${
                      estado === est ? 'text-primary' : 'text-secondaryText'
                    }`}>
                    {est === 'PENDIENTE'
                      ? 'Pendiente'
                      : est === 'EN_CURSO'
                        ? 'Viendo'
                        : 'Completada'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          {/* Calificación */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Tu calificación</Text>
            <View className="flex-row justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setCalificacionPersonal(star)}>
                  <FontAwesome5
                    name="star"
                    size={32}
                    color={star <= calificacionPersonal ? '#fbbf24' : '#475569'}
                    solid={star <= calificacionPersonal}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          {/* Progreso (Temporada / Episodio) */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Progreso</Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="mb-2 text-xs text-secondaryText">Temporada</Text>
                <TextInput
                  value={temporadaActual}
                  onChangeText={(text) => {
                    const numValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    setTemporadaActual(numValue > 10000 ? '10000' : text.replace(/[^0-9]/g, ''));
                  }}
                  placeholder="1"
                  placeholderTextColor={COLORS.placeholderText}
                  keyboardType="numeric"
                  maxLength={5}
                  className="rounded-lg border border-borderButton bg-surfaceButton p-3 text-center text-base text-primaryText"
                />
              </View>
              <View className="flex-1">
                <Text className="mb-2 text-xs text-secondaryText">Episodio</Text>
                <TextInput
                  value={episodioActual}
                  onChangeText={(text) => {
                    const numValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    setEpisodioActual(numValue > 10000 ? '10000' : text.replace(/[^0-9]/g, ''));
                  }}
                  placeholder="1"
                  placeholderTextColor={COLORS.placeholderText}
                  keyboardType="numeric"
                  maxLength={5}
                  className="rounded-lg border border-borderButton bg-surfaceButton p-3 text-center text-base text-primaryText"
                />
              </View>
            </View>
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          {/* Fechas de Visionado */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Fechas de visionado</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => setShowDatePickerInicio(true)}
                  className="flex-row items-center justify-center rounded-xl border border-borderButton bg-surfaceButton px-3 py-2">
                  <MaterialCommunityIcons name="calendar-start" size={20} color="#a855f7" />
                  <View className="ml-3 items-center">
                    <Text className="text-xs text-secondaryText">Inicio</Text>
                    <Text className="text-sm font-bold text-primaryText">
                      {fechaInicio
                        ? fechaInicio.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Sin fecha'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {fechaInicio && (
                  <TouchableOpacity
                    onPress={() => setFechaInicio(null)}
                    className="mt-2 items-center py-1">
                    <Text className="text-xs text-red-400">Quitar fecha</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => setShowDatePickerFin(true)}
                  className="flex-row items-center justify-center rounded-xl border border-borderButton bg-surfaceButton px-3 py-2">
                  <MaterialCommunityIcons name="calendar-end" size={20} color="#a855f7" />
                  <View className="ml-3 items-center">
                    <Text className="text-xs text-secondaryText">Fin</Text>
                    <Text className="text-sm font-bold text-primaryText">
                      {fechaFin
                        ? fechaFin.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'Sin fecha'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {fechaFin && (
                  <TouchableOpacity
                    onPress={() => setFechaFin(null)}
                    className="mt-2 items-center py-1">
                    <Text className="text-xs text-red-400">Quitar fecha</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {showDatePickerInicio && (
              <DateTimePicker
                value={fechaInicio || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, selectedDate?: Date) => {
                  setShowDatePickerInicio(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFechaInicio(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            {showDatePickerFin && (
              <DateTimePicker
                value={fechaFin || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, selectedDate?: Date) => {
                  setShowDatePickerFin(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFechaFin(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          {/* Número de Visualizaciones (Rewatch) */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Veces vista (Rewatch)</Text>
            <View className="flex-row items-center justify-between rounded-xl border border-borderButton bg-surfaceButton px-4 py-3">
              <TouchableOpacity
                onPress={() => setNumVisualizaciones(Math.max(0, numVisualizaciones - 1))}
                className="rounded-lg bg-borderButton p-3">
                <MaterialCommunityIcons name="minus" size={20} color="white" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-2xl font-bold text-primaryText">{numVisualizaciones}</Text>
                <Text className="text-xs text-secondaryText">Visualizaciones completas</Text>
              </View>

              <TouchableOpacity
                onPress={() => setNumVisualizaciones(numVisualizaciones + 1)}
                className="rounded-lg bg-borderButton p-3">
                <MaterialCommunityIcons name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          {/* Reseña */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Tu reseña</Text>
            <TextInput
              value={reseña}
              onChangeText={setReseña}
              placeholder="Escribe tu opinión sobre la serie..."
              placeholderTextColor={COLORS.placeholderText}
              multiline
              numberOfLines={4}
              maxLength={500}
              className="min-h-[100px] rounded-lg border border-borderButton bg-surfaceButton p-3 text-base text-primaryText"
              textAlignVertical="top"
            />
            <Text className="mt-1 text-right text-xs text-secondaryText">{reseña.length}/500</Text>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="mb-24 mt-4 rounded-lg bg-primary py-3"
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold text-primaryText">
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
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

interface Film {
  id: number;
  title: string;
  image: string | null;
  releaseDate: string | null;
  description: string | null;
  rating: number | null;
  genreId: number[] | null;
}

export default function FilmForm() {
  const { filmData, item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const editando = !!item;
  const existeRecurso = editando ? JSON.parse(item as string) : null;
  const film: any = editando ? existeRecurso.contenidopelicula : JSON.parse(filmData as string);

  const [reseña, setReseña] = useState(existeRecurso?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(existeRecurso?.calificacion || 0);
  const [favorita, setFavorita] = useState(existeRecurso?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(existeRecurso?.estado || 'PENDIENTE');
  const [fechaVisionado, setFechaVisionado] = useState<Date>(existeRecurso?.fechaVisionado ? new Date(existeRecurso.fechaVisionado) : new Date());
  const [numVisionados, setNumVisionados] = useState(existeRecurso?.numVisionados || 0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log({
      reseña,
      calificacionPersonal,
      favorita,
      estado,
      fechaVisionado: fechaVisionado.toISOString().split('T')[0],
	  fechaSinFormato: fechaVisionado.toISOString(),
      numVisionados,
    });

    setLoading(true);
    try {
      if (editando) {
        // Actualizar el recurso existente
        const { error: updateError } = await supabase
          .from('recursopelicula')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            fechaVisionado: fechaVisionado.toISOString().split('T')[0],
            numVisionados: numVisionados,
          })
          .eq('id', existeRecurso.id);

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar la película. Inténtalo de nuevo.');
          console.error('Error al actualizar:', updateError);
        } else {
          Alert.alert('¡Éxito!', `Has actualizado ${film.titulo || film.title} en tu colección.`);
          router.back();
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
			descripcion: film.description,
			calificacion: film.rating,
		  }).select('id').single();

		if (insertError)	throw insertError;
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
        Alert.alert("Aviso", "Ya tienes esta película en tu colección.");
		router.back();
        setLoading(false);
        return;
      }

	  // Ahora insertamos el recurso del usuario
      const { error: inventoryError } = await supabase
        .from('recursopelicula')
        .insert({
			usuarioId: user.id,
			idContenido: contentId,
			estado: estado,
			reseña: reseña,
			calificacion: calificacionPersonal,
			favorito: favorita,
			fechaVisionado: fechaVisionado.toISOString().split('T')[0],
			numVisionados: numVisionados,
        });

      if (inventoryError) {
        Alert.alert("Error", "Hubo un problema al guardar la película. Inténtalo de nuevo.");
        console.error('Error al insertar:', inventoryError);
      } else {
        Alert.alert("¡Éxito!", `Has añadido a ${film.title} a tu colección.`);
        router.back();
      }
      }
    } catch (error) {
      console.error('Error saving film data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!film) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la película
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 py-6">
        <TouchableOpacity
          onPress={handleBack}
          className="mb-4 flex-row items-center"
          activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          <Text className="ml-2 text-lg text-primaryText">Volver</Text>
        </TouchableOpacity>

        <View className="mb-6 flex-row items-center rounded-xl border border-borderButton/50 bg-surfaceButton/50 px-4 py-4">
          <Image
            source={{ uri: film.imagenUrl || film.image || 'https://via.placeholder.com/100x150' }}
            className="mr-4 h-24 w-16 rounded-lg border border-borderButton bg-surfaceButton"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-primaryText" numberOfLines={2}>
              {film.titulo || film.title}
            </Text>
            <Text className="mt-1 text-secondaryText">
              {film.fechaLanzamiento || film.releaseDate ? new Date(film.fechaLanzamiento || film.releaseDate).getFullYear() : 'N/A'}
            </Text>
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
                        ? 'En curso'
                        : 'Completada'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

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

          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Visualizaciones</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 flex-row items-center justify-between rounded-xl border border-borderButton bg-surfaceButton px-3 py-2">
                <TouchableOpacity
                  onPress={() => setNumVisionados(Math.max(0, numVisionados - 1))}
                  className="rounded-lg bg-borderButton p-2">
                  <MaterialCommunityIcons name="minus" size={16} color="white" />
                </TouchableOpacity>

                <View className="items-center">
                  <Text className="text-xs text-secondaryText">Vistas</Text>
                  <Text className="text-lg font-bold text-primaryText">{numVisionados}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setNumVisionados(numVisionados + 1)}
                  className="rounded-lg bg-borderButton p-2">
                  <MaterialCommunityIcons name="plus" size={16} color="white" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-1 flex-row items-center justify-center rounded-xl border border-borderButton bg-surfaceButton px-3 py-2">
                <MaterialCommunityIcons name="calendar" size={20} color="#a855f7" />
                <View className="ml-3 items-center">
                  <Text className="text-xs text-secondaryText">Fecha</Text>
                  <Text className="text-sm font-bold text-primaryText">
                    {fechaVisionado.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={fechaVisionado}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, selectedDate?: Date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFechaVisionado(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Tu reseña</Text>
            <TextInput
              value={reseña}
              onChangeText={setReseña}
              placeholder="Escribe tu opinión sobre la película..."
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

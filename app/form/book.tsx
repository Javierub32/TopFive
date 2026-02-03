import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { BookResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';


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
}

export default function BookForm() {
  const { bookData, item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();
  const { colors } = useTheme();
  
  // Si es item, se edita, si no, es nuevo
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const book: any = editando ? resource.contenidolibro : JSON.parse(bookData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorito, setFavorito] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  const [paginasLeidas, setPaginasLeidas] = useState(resource?.paginasLeidas?.toString() || '');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(resource?.fechaInicio ? new Date(resource.fechaInicio) : null);
  const [fechaFin, setFechaFin] = useState<Date | null>(resource?.fechaFin ? new Date(resource.fechaFin) : null);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numPaginas = parseInt(paginasLeidas) || 0;
    if (numPaginas > 2000) {
      Alert.alert('Error', 'El número de páginas no puede ser mayor a 2000');
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
          .select(`
            *,
            contenidolibro:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento,
              descripcion,
              calificacion,
              autor,
              genero
            )
          `)
          .single();

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar el libro. Inténtalo de nuevo.');
          console.error('Error al actualizar:', updateError);
        } else {
          const bookResource: BookResource = updatedData;
          Alert.alert('¡Éxito!', `Has actualizado ${book.title} en tu colección.`);
          router.replace({
            pathname: '/details/book/bookResource',
            params: { 
              item: JSON.stringify(bookResource)
            }
          });
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
        } else {
          // Si no existe, lo creamos
          const { data: newContent, error: insertError } = await supabase 
		  .from('contenidolibro')
            .insert({
              titulo: book.title,
              idApi: book.id,
              imagenUrl: book.imageFull,
              fechaLanzamiento: book.releaseDate,
              descripcion: book.description,
              calificacion: book.rating,
              autor: book.autor,
              genero: book.genre || null,
              idAutor: book.autorId,
              referencia: book.reference,
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
          Alert.alert('Aviso', 'Ya tienes este libro en tu colección.');
          router.back();
          setLoading(false);
          return;
        }

        // Ahora insertamos el recurso del usuario
        const numPaginas = parseInt(paginasLeidas) || 0;
        const { error: inventoryError } = await supabase
          .from('recursolibro')
          .insert({
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
          Alert.alert('Error', 'Hubo un problema al guardar el libro. Inténtalo de nuevo.');
          console.error('Error al insertar:', inventoryError);
        } else {
          Alert.alert('¡Éxito!', `Has añadido ${book.title} a tu colección.`);
		  refreshData();
          router.back();
        }
      }
    } catch (error) {
      console.error('Error saving book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!book) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información del libro
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
            source={{ uri: book.imagenUrl || book.imageFull || 'https://via.placeholder.com/100x150' }}
            className="mr-4 h-24 w-16 rounded-lg border border-borderButton bg-surfaceButton"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-primaryText" numberOfLines={2}>
              {book.titulo || book.title}
            </Text>
            <Text className="mt-1 text-secondaryText">{book.autor || 'Autor desconocido'}</Text>
            <Text className="mt-1 text-secondaryText text-sm">
              {book.fechaLanzamiento || book.releaseDate ? new Date(book.fechaLanzamiento || book.releaseDate).getFullYear() : 'N/A'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setFavorito(!favorito)} className="p-2">
            <MaterialCommunityIcons
              name={favorito ? 'heart' : 'heart-outline'}
              size={32}
              color={favorito ? '#ef4444' : '#94a3b8'}
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
                        ? 'Leyendo'
                        : 'Completado'}
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
            <Text className="mb-3 text-lg font-semibold text-primaryText">Páginas leídas</Text>
            <TextInput
              value={paginasLeidas}
              onChangeText={(text) => {
                // Solo permitir números y limitar a 2000
                const numericText = text.replace(/[^0-9]/g, '');
                const num = parseInt(numericText) || 0;
                if (num <= 2000 || numericText === '') {
                  setPaginasLeidas(numericText);
                }
              }}
              placeholder="Número de páginas"
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
              maxLength={4}
              className="rounded-lg border border-borderButton bg-surfaceButton p-3 text-base text-primaryText"
            />
            <View className="mt-4 h-[1px] bg-borderButton/50" />
          </View>

          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Fechas de lectura</Text>
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

          <View>
            <Text className="mb-3 text-lg font-semibold text-primaryText">Tu reseña</Text>
            <TextInput
              value={reseña}
              onChangeText={setReseña}
              placeholder="Escribe tu opinión sobre el libro..."
              placeholderTextColor={colors.placeholderText}
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

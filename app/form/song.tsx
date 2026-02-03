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
import { SongResource } from 'app/types/Resources';

interface Song {
  id: number | null;
  title: string | null;
  autor: string | null;
  imageFull: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  albumId: number | null;
  album: string | null;
  autorId: number | null;
  reference: string | null;
}

export default function SongForm() {
  const { songData, item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const song: any = editando ? resource.contenidocancion : JSON.parse(songData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  const [fechaEscuchado, setFechaEscuchado] = useState<Date | null>(resource?.fechaEscucha ? new Date(resource.fechaEscucha) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editando) {
        // Modo edición: actualizar el recurso existente
        const { data: updateData, error: updateError } = await supabase
          .from('recursocancion')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            fechaEscucha: fechaEscuchado ? fechaEscuchado.toISOString().split('T')[0] : null,
          })
          .eq('id', resource.id)
          .select(`
            *,
            contenidocancion:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          `)
          .single();

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar la canción. Inténtalo de nuevo.');
          console.error('Error al actualizar:', updateError);
        } else {
          const songResource: SongResource = updateData;
          Alert.alert('¡Éxito!', `Has actualizado ${song.titulo || song.title} en tu colección.`);
          router.replace({
            pathname: '/details/song/songResource',
            params: { 
              item: JSON.stringify(songResource)
            }
          });
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
            imagenUrl: song.imageFull,
            fechaLanzamiento: song.releaseDate,
            autor: song.autor,
            genero: song.genre,
            albumTitulo: song.album,
            albumId: song.albumId,
            autorId: song.autorId,
            referencia: song.reference,
            
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
        Alert.alert('Aviso', 'Ya tienes esta canción en tu colección.');
        router.back();
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
        Alert.alert('Error', 'Hubo un problema al guardar la canción. Inténtalo de nuevo.');
        console.error('Error al insertar:', inventoryError);
      } else {
        Alert.alert('¡Éxito!', `Has añadido ${song.title} a tu colección.`);
        router.back();
      }
      }
    } catch (error) {
      console.error('Error saving song data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!song) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la canción
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 py-4">
        <TouchableOpacity
          onPress={handleBack}
          className="mb-4 flex-row items-center"
          activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          <Text className="ml-2 text-lg text-primaryText">Volver</Text>
        </TouchableOpacity>

        <View className="mb-6 flex-row items-center rounded-xl border border-borderButton/50 bg-surfaceButton/50 px-4 py-4">
          <Image
            source={{ uri: song.imagenUrl || song.imageFull || 'https://via.placeholder.com/100x100' }}
            className="mr-4 h-20 w-20 rounded-lg border border-borderButton bg-surfaceButton"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-primaryText" numberOfLines={2}>
              {song.titulo || song.title}
            </Text>
            <Text className="mt-1 text-secondaryText">{song.autor || 'Artista desconocido'}</Text>
            {(song.albumTitulo || song.album) && (
              <Text className="mt-1 text-secondaryText text-sm" numberOfLines={1}>
                {song.albumTitulo || song.album}
              </Text>
            )}
            <Text className="mt-1 text-secondaryText text-sm">
              {song.fechaLanzamiento || song.releaseDate ? new Date(song.fechaLanzamiento || song.releaseDate).getFullYear() : 'N/A'}
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
            <View className="flex-row justify-center gap-4 px-8">
              {(['PENDIENTE', 'COMPLETADO'] as const).map((est) => (
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
                    {est === 'PENDIENTE' ? 'Pendiente' : 'Completado'}
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
            <Text className="mb-3 text-lg font-semibold text-primaryText">Fecha de escucha</Text>
            <View className="items-center">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-[70%] flex-row items-center justify-center rounded-xl border border-borderButton bg-surfaceButton px-4 py-3">
                <MaterialCommunityIcons name="calendar" size={24} color="#a855f7" />
                <View className="ml-3 items-center">
                  <Text className="text-sm text-secondaryText">Última escucha</Text>
                  <Text className="text-base font-bold text-primaryText">
                    {fechaEscuchado
                      ? fechaEscuchado.toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Sin fecha'}
                  </Text>
                </View>
              </TouchableOpacity>
              {fechaEscuchado && (
                <TouchableOpacity
                  onPress={() => setFechaEscuchado(null)}
                  className="mt-2 items-center py-1">
                  <Text className="text-xs text-red-400">Quitar fecha</Text>
                </TouchableOpacity>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={fechaEscuchado || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, selectedDate?: Date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFechaEscuchado(selectedDate);
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
              placeholder="Escribe tu opinión sobre la canción..."
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

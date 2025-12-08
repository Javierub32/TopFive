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
  const { songData } = useLocalSearchParams();
  const router = useRouter();
  const song: Song = JSON.parse(songData as string);
  const { user } = useAuth();

  const [reseña, setReseña] = useState('');
  const [calificacionPersonal, setCalificacionPersonal] = useState(0);
  const [favorita, setFavorita] = useState(false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'COMPLETADO'>('PENDIENTE');
  const [fechaEscuchado, setFechaEscuchado] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
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
      const { data: existingResource, error: checkError } = await supabase
        .from('recursocancion')
        .select('id')
        .eq('idContenido', contentId)
        .eq('usuarioId', user.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingResource) {
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
          <Text className="mt-4 text-xl font-bold text-white">Error al cargar</Text>
          <Text className="mt-2 text-center text-gray-400">
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
          <Text className="ml-2 text-lg text-white">Volver</Text>
        </TouchableOpacity>

        <View className="mb-6 flex-row items-center rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-4">
          <Image
            source={{ uri: song.imageFull || 'https://via.placeholder.com/100x100' }}
            className="mr-4 h-20 w-20 rounded-lg border border-slate-700 bg-slate-800"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-white" numberOfLines={2}>
              {song.title}
            </Text>
            <Text className="mt-1 text-gray-400">{song.autor || 'Artista desconocido'}</Text>
            {song.album && (
              <Text className="mt-1 text-gray-500 text-sm" numberOfLines={1}>
                {song.album}
              </Text>
            )}
            <Text className="mt-1 text-gray-500 text-sm">
              {song.releaseDate ? new Date(song.releaseDate).getFullYear() : 'N/A'}
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
            <Text className="mb-3 text-lg font-semibold text-white">Estado</Text>
            <View className="flex-row justify-center gap-4 px-8">
              {(['PENDIENTE', 'COMPLETADO'] as const).map((est) => (
                <TouchableOpacity
                  key={est}
                  onPress={() => setEstado(est)}
                  className={`flex-1 rounded-lg border py-3 ${
                    estado === est
                      ? 'border-purple-600 bg-purple-600/20'
                      : 'border-slate-700 bg-slate-800'
                  }`}>
                  <Text
                    className={`text-center text-sm ${
                      estado === est ? 'text-purple-400' : 'text-gray-400'
                    }`}>
                    {est === 'PENDIENTE' ? 'Pendiente' : 'Completado'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Tu calificación</Text>
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
            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Fecha de escucha</Text>
            <View className="items-center">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-[70%] flex-row items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                <MaterialCommunityIcons name="calendar" size={24} color="#a855f7" />
                <View className="ml-3 items-center">
                  <Text className="text-sm text-gray-400">Última escucha</Text>
                  <Text className="text-base font-bold text-white">
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
            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Tu reseña</Text>
            <TextInput
              value={reseña}
              onChangeText={setReseña}
              placeholder="Escribe tu opinión sobre la canción..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              maxLength={500}
              className="min-h-[100px] rounded-lg border border-slate-700 bg-slate-800 p-3 text-base text-white"
              textAlignVertical="top"
            />
            <Text className="mt-1 text-right text-xs text-gray-500">{reseña.length}/500</Text>
          </View>

		  {/* Botón Guardar */}
		  <TouchableOpacity
			onPress={handleSubmit}
			disabled={loading}
			className="mb-24 mt-4 rounded-lg bg-purple-600 py-3"
			activeOpacity={0.8}>
			<Text className="text-center text-lg font-bold text-white">
			  {loading ? 'Guardando...' : 'Guardar'}
			</Text>
		  </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

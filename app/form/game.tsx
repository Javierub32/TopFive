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

interface Game {
  id: number;
  title: string;
  autor: string | null; // Desarrollador
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  description: string | null;
  rating: number | null;
  platforms: string[] | null;
  gamemodes: string[] | null;
  imageFull: string | null;
}

const DIFFICULTIES = [ 'Fácil', 'Normal', 'Difícil', 'Extremo'];

export default function GameForm() {
  const { gameData } = useLocalSearchParams();
  const router = useRouter();
  const game: Game = JSON.parse(gameData as string);
  const { user } = useAuth();

  const [reseña, setReseña] = useState('');
  const [calificacionPersonal, setCalificacionPersonal] = useState(0);
  const [favorito, setFavorito] = useState(false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ABANDONADO'>('PENDIENTE');
  
  // Campos específicos de videojuegos
  const [horasJugadas, setHorasJugadas] = useState('');
  const [dificultad, setDificultad] = useState<string>('Normal');

  // Fechas (Lógica traída de series.tsx)
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const horasNum = parseFloat(horasJugadas) || 0;

    setLoading(true);
    try {
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
            descripcion: game.description,
            calificacion: game.rating,
            autor: game.autor,
            genero: game.genre,
            plataformas: game.platforms,
            modosJuego: game.gamemodes,
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
        Alert.alert('Aviso', 'Ya tienes este videojuego en tu colección.');
        router.back();
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
        Alert.alert('Error', 'Hubo un problema al guardar el videojuego. Inténtalo de nuevo.');
        console.error('Error al insertar:', inventoryError);
      } else {
        Alert.alert('¡Éxito!', `Has añadido ${game.title} a tu colección.`);
        router.back();
      }
    } catch (error) {
      console.error('Error saving game data:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!game) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="mt-4 text-xl font-bold text-white">Error al cargar</Text>
          <Text className="mt-2 text-center text-gray-400">
            No se pudo cargar la información del videojuego
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
          <Text className="ml-2 text-lg text-white">Volver</Text>
        </TouchableOpacity>

        {/* Tarjeta de Resumen */}
        <View className="mb-6 flex-row items-center rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-4">
          <Image
            source={{ uri: game.image || 'https://via.placeholder.com/100x150' }}
            className="mr-4 h-24 w-16 rounded-lg border border-slate-700 bg-slate-800"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-white" numberOfLines={2}>
              {game.title}
            </Text>
            <Text className="mt-1 text-gray-400">
               {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A'}
            </Text>
            <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
                {game.autor || 'Desarrollador desconocido'}
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
          {/* Selector de Estado */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Estado</Text>
            <View className="flex-row gap-2">
              {(['PENDIENTE', 'EN_CURSO', 'COMPLETADO'] as const).map((est) => (
                <TouchableOpacity
                  key={est}
                  onPress={() => setEstado(est)}
                  className={`flex-1 rounded-lg border py-3 ${
                    estado === est
                      ? 'border-purple-600 bg-purple-600/20'
                      : 'border-slate-700 bg-slate-800'
                  }`}>
                  <Text
                    className={`text-center text-xs font-semibold ${
                      estado === est ? 'text-purple-400' : 'text-gray-400'
                    }`}>
                    {est === 'PENDIENTE'
                      ? 'Pendiente'
                      : est === 'EN_CURSO'
                        ? 'Jugando'
                        : 'Completado'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          {/* Calificación */}
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

          {/* Detalles de Juego: Horas y Dificultad */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Detalles de partida</Text>
            
            {/* Horas Jugadas */}
            <View className="mb-4">
              <Text className="mb-2 text-sm text-gray-400">Horas jugadas</Text>
              <View className="flex-row items-center">
                <TextInput
                  value={horasJugadas}
                  onChangeText={(text) => {
                     // Permitir solo números y un punto decimal
                     if (/^\d*\.?\d*$/.test(text)) {
                         setHorasJugadas(text);
                     }
                  }}
                  placeholder="0"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  maxLength={5}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 p-3 text-base text-white"
                />
              </View>
            </View>

            {/* Selector de Dificultad */}
            <View>
              <Text className="mb-2 text-sm text-gray-400">Dificultad completada</Text>
              <View className="flex-row flex-wrap gap-2">
                {DIFFICULTIES.map((diff) => (
                   <TouchableOpacity
                     key={diff}
                     onPress={() => setDificultad(diff)}
                     className={`rounded-full border px-4 py-2 ${
                        dificultad === diff
                         ? 'border-purple-500 bg-purple-500/30'
                         : 'border-slate-700 bg-slate-800'
                     }`}
                   >
                     <Text className={`text-sm ${
                        dificultad === diff ? 'text-white font-bold' : 'text-gray-400'
                     }`}>
                       {diff}
                     </Text>
                   </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          {/* Fechas (Inicio y Fin) */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Fechas de juego</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => setShowDatePickerInicio(true)}
                  className="flex-row items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
                  <MaterialCommunityIcons name="calendar-start" size={20} color="#a855f7" />
                  <View className="ml-3 items-center">
                    <Text className="text-xs text-gray-400">Inicio</Text>
                    <Text className="text-sm font-bold text-white">
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
                  className="flex-row items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
                  <MaterialCommunityIcons name="calendar-end" size={20} color="#a855f7" />
                  <View className="ml-3 items-center">
                    <Text className="text-xs text-gray-400">Fin</Text>
                    <Text className="text-sm font-bold text-white">
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
            <View className="mt-4 h-[1px] bg-slate-700/50" />
          </View>

          {/* Reseña */}
          <View>
            <Text className="mb-3 text-lg font-semibold text-white">Tu reseña</Text>
            <TextInput
              value={reseña}
              onChangeText={setReseña}
              placeholder="Escribe tu opinión sobre el videojuego..."
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
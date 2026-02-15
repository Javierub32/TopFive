import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { GameResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { ReturnButton } from "components/ReturnButton";
import { FavoriteSetter } from "@/Form/components/FavoriteSetter";
import { ReviewSetter } from "@/Form/components/ReviewSetter";
import { StateSetter } from "@/Form/components/StateSetter";
import { RatingSetter } from "@/Form/components/RatingSetter";
import { ProgressSetter } from "@/Form/components/ProgressSetter";
import { DateSetter } from "@/Form/components/DateSetter";
import { DifficultySetter } from "@/Form/components/DifficultySetter";

interface Game {
  id: number;
  title: string;
  autor: string | null; 
  image: string | null;
  releaseDate: string | null;
  genre: string[] | null;
  description: string | null;
  rating: number | null;
  platforms: string[] | null;
  gamemodes: string[] | null;
  imageFull: string | null;
}

export default function GameForm() {
  const { gameData, item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();
  
  const { colors } = useTheme();
  
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const game: any = editando ? resource.contenido : JSON.parse(gameData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorito, setFavorito] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ABANDONADO'>(resource?.estado || 'PENDIENTE');
  
  // Campos específicos de videojuegos
  const [horasJugadas, setHorasJugadas] = useState(resource?.horasJugadas?.toString() || '');
  const [dificultad, setDificultad] = useState<string>(resource?.dificultad || 'Normal');

  // Fechas
  const [fechaInicio, setFechaInicio] = useState<Date | null>(resource?.fechaInicio ? new Date(resource.fechaInicio) : null);
  const [fechaFin, setFechaFin] = useState<Date | null>(resource?.fechaFin ? new Date(resource.fechaFin) : null);

  const [loading, setLoading] = useState(false);

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
          .select(`
            *,
            contenidovideojuego:idContenido (
              titulo,
              imagenUrl,
              fechaLanzamiento              
            )
          `)
          .single();

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar el videojuego. Inténtalo de nuevo.');
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

          Alert.alert('¡Éxito!', `Has actualizado ${game.titulo || game.title} en tu colección.`);
		  refreshData();
          router.replace({
            pathname: '/details/game/gameResource',
            params: { 
              item: JSON.stringify(gameResource)
            }
          });
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
		refreshData();
        router.back();
      }
      }
    } catch (error) {
      console.error('Error saving game data:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };


  if (!game) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="mt-2 text-center" style={{color: colors.secondaryText}}>
            No se pudo cargar la información del videojuego
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar/>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          <View className="flex-1 flex-row items-center">
            <ReturnButton route="back" title={game.titulo || game.title} style={' '}/>
          </View>
          <FavoriteSetter favorite={favorito} setFavorite={setFavorito}/>
        </View>

        <View className="flex-1 flex-row justify-between gap-2 px-4 mb-4 items-stretch">
          <Image source={{uri:game.imagenUrl || game.image || 'https://via.placeholder.com/100x150'}} 
          className="aspect-[2/3] h-32 rounded-lg" style={{backgroundColor: colors.surfaceButton}}
          resizeMode="cover"/>
          <ReviewSetter review={reseña} setReview={setReseña}/>
        </View>

        <View className="gap-6">
          <StateSetter state={estado} setState={setEstado}/>
          <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal}/>
          <DifficultySetter difficulty={dificultad} setDifficulty={setDificultad}/>
          <ProgressSetter progress={horasJugadas} setProgress={setHorasJugadas} type='videojuego'/>
          <DateSetter startDate={fechaInicio} setStartDate={setFechaInicio} endDate={fechaFin} setEndDate={setFechaFin} isRange={true}/>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="mb-14 rounded-lg py-3 mx-4"
            style={{backgroundColor: colors.primary}}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold" style={{color:colors.background}}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
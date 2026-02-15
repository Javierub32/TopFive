import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { SongResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { ReturnButton } from "components/ReturnButton";
import { FavoriteSetter } from "@/Form/components/FavoriteSetter";
import { ReviewSetter } from "@/Form/components/ReviewSetter";
import { StateSetter } from "@/Form/components/StateSetter";
import { RatingSetter } from "@/Form/components/RatingSetter";
import { DateSetter } from "@/Form/components/DateSetter";

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
  const { refreshData } = useCollection();
  
  const { colors } = useTheme();
  
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const song: any = editando ? resource.contenido : JSON.parse(songData as string);

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
        const { data: updatedData, error: updateError } = await supabase
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
		  // Adaptamos la respuesta para mantener compatibilidad
		  const rawData = updatedData as any;
		  const contentData = rawData.contenidocancion;
		  delete rawData.contenidocancion;
		  const songResource: SongResource = {
			...rawData,
			contenido: contentData,
		  };

          Alert.alert('¡Éxito!', `Has actualizado ${song.titulo || song.title} en tu colección.`);
		  refreshData();
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
		refreshData();
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
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="mt-2 text-center" style={{color: colors.secondaryText}}>
            No se pudo cargar la información de la cancion
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
            <ReturnButton route="back" title={song.titulo || song.title} style={' '}/>
          </View>
          <FavoriteSetter favorite={favorita} setFavorite={setFavorita}/>
        </View>
        <View className="flex-1 flex-row justify-between gap-2 px-4 mb-4 items-stretch">
          <Image source={{uri: song.imagenUrl || song.image || 'https://via.placeholder.com/100x150'}}
          className="aspect-[2/3] h-32 rounded-lg" style={{backgroundColor: colors.surfaceButton}}
          resizeMode="cover"/>
          <ReviewSetter review={reseña} setReview={setReseña}/>
        </View>

        <View className="gap-6">
          <StateSetter resource={resource}/>
          <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal}/>
          <DateSetter startDate={fechaEscuchado} setStartDate={setFechaEscuchado} isRange={false}/>
        </View>

        <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="mb-14 rounded-lg py-3 mx-4 mt-4"
            style={{backgroundColor: colors.primary}}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold" style={{color:colors.background}}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

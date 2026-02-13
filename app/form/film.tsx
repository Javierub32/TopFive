import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { FilmResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from "components/ThemedStatusBar";
import { ReturnButton } from "components/ReturnButton";
import { FavoriteSetter } from "@/Form/components/FavoriteSetter";
import { ReviewSetter } from "@/Form/components/ReviewSetter";
import { StateSetter } from "@/Form/components/StateSetter";
import { RatingSetter } from "@/Form/components/RatingSetter";
import { DateSetter } from "@/Form/components/DateSetter";
import { ViewsSetter } from "@/Form/components/ViewsSetter";

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
  const { refreshData } = useCollection();
  
  const { colors } = useTheme();
  
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const film: any = editando ? resource.contenido : JSON.parse(filmData as string);

  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorita, setFavorita] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  const [fechaVisionado, setFechaVisionado] = useState<Date>(resource?.fechaVisionado ? new Date(resource.fechaVisionado) : new Date());
  const [numVisionados, setNumVisionados] = useState(resource?.numVisionados || 0);

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
        const { data: updatedData, error: updateError } = await supabase
          .from('recursopelicula')
          .update({
            estado: estado,
            reseña: reseña,
            calificacion: calificacionPersonal,
            favorito: favorita,
            fechaVisionado: fechaVisionado.toISOString().split('T')[0],
            numVisionados: numVisionados,
          })
          .eq('id', resource.id)
          .select(`
            *,
            contenidopelicula (
              titulo,
              imagenUrl,
              fechaLanzamiento
            )
          `)
          .single();

        if (updateError) {
          Alert.alert('Error', 'Hubo un problema al actualizar la película. Inténtalo de nuevo.');
          console.error('Error al actualizar:', updateError);
        } else {
		  // Adaptamos la respuesta para mantener compatibilidad
          const rawData = updatedData as any;
          const contentData = rawData.contenidopelicula;
          delete rawData.contenidopelicula;
          const filmResource: FilmResource = {
            ...rawData,
            contenido: contentData,
          };

          Alert.alert('¡Éxito!', `Has actualizado ${film.titulo || film.title} en tu colección.`);
		  refreshData();
          router.replace({
            pathname: '/details/film/filmResource',
            params: {
              item: JSON.stringify(filmResource)
            }
          });
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
    	refreshData();
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
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="mt-2 text-center" style={{color: colors.secondaryText}}>
            No se pudo cargar la información de la película
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
            <ReturnButton route="back" title={film.titulo || film.title} style={' '}/>
          </View>
          <FavoriteSetter resource={resource}/>
        </View>


        <View className="flex-1 flex-row justify-between gap-2 px-4 mb-4 items-stretch">
          <Image source={{uri: film.imagenUrl || film.image || 'https://via.placeholder.com/100x150'}}
          className="aspect-[2/3] h-32 rounded-lg" style={{backgroundColor: colors.surfaceButton}}
          resizeMode="cover"/>
          <ReviewSetter resource={resource}/>
        </View>

        <View className="gap-6">
          <StateSetter resource={resource}/>
          <RatingSetter resource={resource}/>

          <View className="flex-row justify-between gap-3 px-4 pt-2">
            <ViewsSetter resource={resource}/>
            <DateSetter resource={resource} isRange={false}/>
          </View>
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

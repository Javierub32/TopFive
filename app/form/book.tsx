import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { BookResource } from 'app/types/Resources';
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
import { useNotification } from 'context/NotificationContext';

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
  const { bookData, item, from } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshData } = useCollection();
  const { colors } = useTheme();
  const { showNotification} = useNotification();

  // Si es item, se edita, si no, es nuevo
  const editando = !!item;
  const resource = editando ? JSON.parse(item as string) : null;
  const book: Book = editando ? resource.contenido : JSON.parse(bookData as string);


  const [reseña, setReseña] = useState(resource?.reseña || '');
  const [calificacionPersonal, setCalificacionPersonal] = useState(resource?.calificacion || 0);
  const [favorito, setFavorito] = useState(resource?.favorito || false);
  const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(resource?.estado || 'PENDIENTE');
  const [paginasLeidas, setPaginasLeidas] = useState(resource?.paginasLeidas?.toString() || '');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(resource?.fechaInicio ? new Date(resource.fechaInicio) : null);
  const [fechaFin, setFechaFin] = useState<Date | null>(resource?.fechaFin ? new Date(resource.fechaFin) : null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const numPaginas = parseInt(paginasLeidas) || 0;
    if (numPaginas > 2000) {
      showNotification({
        title: 'Número de páginas no válido',
        description: 'El número de páginas no puede ser mayor a 2000. Por favor, ingresa un número válido.',
        isChoice: false,
        delete: false
      });
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
              fechaLanzamiento
            )
          `)
          .single();

        if (updateError) {
          showNotification({
            title: 'Error al actualizar',
            description: 'Hubo un problema al actualizar el libro. Inténtalo de nuevo.',
            isChoice: false,
            delete: false
          });
          console.error('Error al actualizar:', updateError);
        } else {
		  // Adaptamos la respuesta para mantener compatibilidad
		  const rawData = updatedData as any;
		  const contentData = rawData.contenidolibro;
		  delete rawData.contenidolibro;
		  const bookResource: BookResource = {
			...rawData,
			contenido: contentData,
		};
		  refreshData();
          router.replace({
            pathname: '/details/book/bookResource',
            params: { 
              item: JSON.stringify(bookResource),
              from: from
            }
          });
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: '¡Éxito!',
              description: `Has actualizado ${book.title || "este libro"} en tu colección.`,
              isChoice: false,
              delete: false
            });
          }, 100);
          
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
              imagenUrl: book.imageFull || book.image,
              fechaLanzamiento: book.releaseDate,
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
          refreshData();
          router.back();
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: 'Aviso',
              description: 'Ya tienes este libro en tu colección.',
              isChoice: false,
              delete: false
            });
          }, 100);
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
          showNotification({
            title: 'Error al guardar',
            description: 'Hubo un problema al guardar el libro. Inténtalo de nuevo.',
            isChoice: false,
            delete: false
          });
          console.error('Error al insertar:', inventoryError);
        } else {
          refreshData();
          router.back();
          // Mostrar modal después de navegar
          setTimeout(() => {
            showNotification({
              title: '¡Éxito!',
              description: `Has añadido ${book.title} a tu colección.`,
              isChoice: false,
              delete: false
            });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving book data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return (
      <Screen>
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{color: colors.primaryText}}>Error al cargar</Text>
          <Text className="mt-2 text-center" style={{color: colors.secondaryText}}>
            No se pudo cargar la información del libro
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
            <ReturnButton route="back" title={book.title || "Detalle del libro"} style={' '}/>
          </View>
          <FavoriteSetter favorite={favorito} setFavorite={setFavorito}/>
        </View>

        <View className="flex-row justify-between gap-2 px-4 mb-4 items-stretch">
          <Image source={{uri: book.imageFull || book.image || 'https://via.placeholder.com/100x150'}}
          className="aspect-[2/3] h-32 rounded-lg" style={{backgroundColor: colors.surfaceButton}} resizeMode="cover"/>
          <ReviewSetter review={reseña} setReview={setReseña}/>
        </View>

        <View className="gap-6">
          <StateSetter state={estado} setState={setEstado} inProgressLabel="Leyendo"/>
          <RatingSetter rating={calificacionPersonal} setRating={setCalificacionPersonal}/>

          {estado !== 'COMPLETADO' && (
            <ProgressSetter progress={paginasLeidas} setProgress={setPaginasLeidas} type='libro'/>
          )}
          

          <DateSetter startDate={fechaInicio} setStartDate={setFechaInicio} endDate={fechaFin} setEndDate={setFechaFin} isRange={true}/>
        </View>
        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="mb-14 rounded-lg py-3 mx-4 mt-4"
          style= {{ backgroundColor: colors.primary}}
          activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold" style={{color: colors.background}}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

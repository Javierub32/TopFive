import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { BookResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useResource } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';


export default function BookDetail() {
  const { item } = useLocalSearchParams();
  const { borrarRecurso } = useResource();
  const { colors } = useTheme();
  
  let bookResource: BookResource | null = null;

  try {
    bookResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const handleDelete = () => {
	if (bookResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este libro de tu colección?', [
			{ text: 'Confirmar', onPress: () => {borrarRecurso(bookResource.id, 'libro'); router.replace({ pathname: '/Collection', params: { initialResource: 'Libros' } })} },
			{ text: 'Cancelar', style: 'cancel'}
		]);
	}
  };
  const handleEdit = () => {
  if (bookResource) {
    router.push({
      pathname: '/form/book',
      params: { item: JSON.stringify(bookResource) }
    });
  }
};

  if (!bookResource) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-primaryText text-xl font-bold mt-4">Error al cargar</Text>
          <Text className="text-secondaryTextyText text-center mt-2">No se pudo cargar la información del libro</Text>
        </View>
      </Screen>
    );
  }

  const { contenidolibro } = bookResource;
  const releaseYear = contenidolibro.fechaLanzamiento ? new Date(contenidolibro.fechaLanzamiento).getFullYear() : 'N/A';
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_CURSO': return 'Leyendo';
      case 'COMPLETADO': return 'Completado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-borderButton';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      default: return 'bg-borderButton';
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle del libro'} style={" "} params={{initialResource: 'Libros'}}/>
          </View>
          {/* Botón de editar */}
          <TouchableOpacity 
            onPress={() => handleEdit()}
            className="h-10 w-10 items-center justify-center rounded-full bg-blue-600 border border-blue-500 mr-2"
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Botón de eliminar */}
          <TouchableOpacity 
            onPress={handleDelete}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-600 border border-red-500 mr-2"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Imagen del libro */}
        <View className="px-4 mb-4">
          <Image 
            source={{ uri: contenidolibro.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl bg-background"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          {/* Título y año */}
          <View className="mb-4">
            <Text className="text-primaryText text-3xl font-bold mb-2">
              {contenidolibro.titulo || 'Sin título'}
            </Text>
            
            <View className="flex-row items-center flex-wrap gap-2">
              {/* Año de publicación */}
              <View className="bg-surfaceButton px-3 py-1.5 rounded-lg border border-borderButton">
                <Text className="text-secondaryText text-sm font-semibold">
                  {releaseYear}
                </Text>
              </View>

              {/* Estado */}
              <View className={`px-3 py-1.5 rounded-lg ${getStatusColor(bookResource.estado)}`}>
                <Text className="text-primaryText text-xs font-bold uppercase">
                  {getStatusText(bookResource.estado)}
                </Text>
              </View>

              {/* Favorito */}
              {bookResource.favorito && (
                <View className="bg-red-900/40 px-3 py-1.5 rounded-lg border border-red-500/30 flex-row items-center">
                  <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                  <Text className="text-red-300 text-xs font-bold ml-1">Favorito</Text>
                </View>
              )}
            </View>
          </View>

          {/* Información en tarjetas */}
          <View className="gap-4 mb-6">
            {/* Tu calificación */}
            {bookResource.calificacion > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Tu calificación
                </Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome5
                      key={star}
                      name="star"
                      size={20}
                      color={star <= bookResource.calificacion ? '#fbbf24' : '#475569'}
                      solid={star <= bookResource.calificacion}
                      style={{ marginRight: 4 }}
                    />
                  ))}
                  <Text className="text-primaryText text-lg font-bold ml-2">
                    {bookResource.calificacion}/5
                  </Text>
                </View>
              </View>
            )}

            {/* Calificación general */}
            {contenidolibro.calificacion && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Calificación general
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="star" size={24} color="#fbbf24" />
                  <Text className="text-primaryText text-lg font-bold ml-2">
                    {contenidolibro.calificacion.toFixed(1)}/10
                  </Text>
                </View>
              </View>
            )}

            {/* Páginas leídas */}
            {bookResource.paginasLeidas > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Páginas leídas
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colors.primary} />
                  <Text className="text-primaryText text-lg font-bold ml-2">
                    {bookResource.paginasLeidas} páginas
                  </Text>
                </View>
              </View>
            )}

            {/* Fechas de lectura */}
            {(bookResource.fechaInicio || bookResource.fechaFin) && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-3 uppercase">
                  Periodo de lectura
                </Text>
                <View className="gap-2">
                  {bookResource.fechaInicio && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} />
                      <Text className="text-secondaryTextyText text-sm ml-2 mr-2">Inicio:</Text>
                      <Text className="text-primaryText text-sm font-semibold">
                        {new Date(bookResource.fechaInicio).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  )}
                  {bookResource.fechaFin && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="calendar-end" size={20} color={colors.primary} />
                      <Text className="text-secondaryTextyText text-sm ml-2 mr-2">Fin:</Text>
                      <Text className="text-primaryText text-sm font-semibold">
                        {new Date(bookResource.fechaFin).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Autor */}
            {contenidolibro.autor && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Autor
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                  <Text className="text-primaryText text-base ml-2">
                    {contenidolibro.autor}
                  </Text>
                </View>
              </View>
            )}

            {/* Géneros */}
            {contenidolibro.genero && contenidolibro.genero.length > 0 && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Géneros
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {contenidolibro.genero.map((genre, index) => (
                    <View key={index} className="bg-marker px-3 py-1.5 rounded-lg border border-primary/30">
                      <Text className="text-primary text-sm">
                        {genre}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Descripción */}
            {contenidolibro.descripcion && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Descripción
                </Text>
                <Text className="text-secondaryText text-base leading-6">
                  {contenidolibro.descripcion}
                </Text>
              </View>
            )}

            {/* Tu reseña */}
            {bookResource.reseña && (
              <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
                <Text className="text-title text-sm font-bold mb-2 uppercase">
                  Tu reseña
                </Text>
                <Text className="text-primaryText text-base leading-6">
                  {bookResource.reseña}
                </Text>
              </View>
            )}

            {/* Fecha de agregado */}
            <View className="bg-surfaceButton p-4 rounded-xl border border-borderButton">
              <Text className="text-title text-sm font-bold mb-2 uppercase">
                Agregado a tu colección
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="calendar-plus" size={20} color={colors.primary} />
                <Text className="text-primaryText text-sm ml-2">
                  {new Date(bookResource.fechacreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

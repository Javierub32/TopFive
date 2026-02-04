import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { BookResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useResource } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


export default function BookDetail() {
  const { item } = useLocalSearchParams();
  const { borrarRecurso } = useResource();
  const { refreshData } = useCollection();
  const { colors } = useTheme();
  
  let bookResource: BookResource | null = null;

  try {
    bookResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const getReadingDuration = () => {
    if (!bookResource?.fechaInicio) return null;

    const start = new Date(bookResource.fechaInicio);
    let end = new Date(); // Por defecto: hoy (para EN_CURSO)

    // Si está completado y tiene fecha fin, usamos esa
    if (bookResource.estado === 'COMPLETADO' && bookResource.fechaFin) {
      end = new Date(bookResource.fechaFin);
    } 
    // Si está pendiente, no mostramos nada (o podrías retornar "0 días")
    else if (bookResource.estado === 'PENDIENTE') {
        return null;
    }

    // Normalizamos las horas para contar días naturales completos
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    // Convertimos milisegundos a días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '0 días'; // Por si las fechas están al revés
    if (diffDays === 0) return '1 día'; // Mismo día cuenta como 1
    return `${diffDays} días`;
  };

  const readingTime = getReadingDuration();

  const handleDelete = () => {
	if (bookResource) {
		Alert.alert('Recurso eliminado', 'Estás seguro de que quieres eliminar este libro de tu colección?', [
      { text: 'Cancelar', style: 'cancel'},
			{ text: 'Confirmar', onPress: async () => {
				await borrarRecurso(bookResource.id, 'libro');
				refreshData();
				router.replace({ pathname: '/Collection', params: { initialResource: 'Libros' } })} }
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
        <ThemedStatusBar/>
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="text-xl font-bold mt-4" style={{ color: colors.primaryText }}>Error al cargar</Text>
          <Text className="text-center mt-2" style={{ color: colors.secondaryText }}>No se pudo cargar la información del libro</Text>
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
      case 'PENDIENTE': return colors.warning;
      case 'EN_CURSO': return colors.accent;  
      case 'COMPLETADO': return colors.success;
      default: return colors.surfaceButton;
    }
  };

  return (
    <Screen>
      <ThemedStatusBar/>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con botón de volver y botón de eliminar */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <View className="flex-row items-center flex-1">
            <ReturnButton route="/Collection" title={'Detalle del libro'} style={" "} params={{initialResource: 'Libros'}}/>
          </View>
          {/* Botón de editar */}
          <TouchableOpacity 
            onPress={() => handleEdit()}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style={{backgroundColor: `${colors.primary}99`, borderColor: colors.primary}}
            activeOpacity={0.7}
          >
            <AntDesign name="edit" size={20} color={colors.primaryText} />
          </TouchableOpacity>

          {/* Botón de eliminar */}
          <TouchableOpacity 
            onPress={handleDelete}
            className="h-10 w-10 items-center justify-center rounded-full mr-2 border-2"
            style={{backgroundColor: `${colors.error}99`, borderColor: colors.error}}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="delete" size={24} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Imagen del libro */}
        <View className="px-4 mb-4">
          <Image 
            source={{ uri: contenidolibro.imagenUrl || 'https://via.placeholder.com/500x750' }}
            className="w-full h-[500px] rounded-2xl"
            style={{ backgroundColor: colors.surfaceButton }}
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-6">
          {/* Título y año */}
          <View className="mb-4">
            <Text className="text-3xl font-bold mb-2" style={{ color: colors.primaryText }}>
              {contenidolibro.titulo || 'Sin título'}
            </Text>
            
            <View className="flex-row items-stretch flex-wrap gap-2">
              {/* Año de publicación */}
              <View className="px-3 py-1.5 rounded-lg justify-center" style={{ backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-semibold" style={{ color: colors.markerText }}>
                  {releaseYear}
                </Text>
              </View>

              {/* Estado */}
              <View className="px-3 py-1.5 rounded-lg justify-center" style={{backgroundColor: `${getStatusColor(bookResource.estado)}33`}}>
                <Text className="text-sm font-semibold uppercase" style={{ color: getStatusColor(bookResource.estado) }}>
                  {getStatusText(bookResource.estado)}
                </Text>
              </View>

              {/* Favorito */}
              {bookResource.favorito && (
                <View className="px-3 py-1.5 rounded-lg justify-center" style={{ backgroundColor: `${colors.favorite}33`}}>
                  <MaterialCommunityIcons name="heart" size={16} color={colors.favorite} />
                </View>
              )}
            </View>
          </View>

          {/* Información en tarjetas */}
          {/* Usamos flex-wrap y widths porcentuales para simular CSS Grid */}
          <View className="flex-row flex-wrap justify-between gap-y-3 gap-x-2">
            {/* CARD 1: Calificación (48% width) */}
            <View 
              className="w-[49%] p-4 rounded-2xl flex justify-between gap-2"
              style={{ backgroundColor: colors.surfaceButton}}
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="star-circle" size={20} color={colors.rating} />
                <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>RATING</Text>
              </View>
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome5
                    key={star}
                    name="star"
                    size={20}
                    color={star <= bookResource.calificacion ? colors.rating : colors.markerText}
                    solid={star <= bookResource.calificacion}
                    style={{ marginRight: 4 }}
                  />
                ))}
              </View>
            </View>

            {/* CARD 2: Progreso (48% width) */}
            <View 
              className="w-[49%] p-4 rounded-2xl flex justify-between gap-2"
              style={{ backgroundColor: colors.surfaceButton }}
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary} />
                <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>PROGRESO</Text>
              </View>
              <View className="flex-row items-baseline">
                <Text className="text-xl font-bold" style={{ color: colors.primaryText }}>
                  {bookResource.paginasLeidas || 0}
                </Text>
                <Text className="text-xs ml-1" style={{ color: colors.markerText }}>págs</Text>
              </View>
            </View>

            {/* CARD 3: Reseña (100% width - Wide Item) */}
            <View 
              className="w-full p-5 rounded-2xl space-y-3 border-l-4"
              style={{ backgroundColor: colors.surfaceButton , borderColor: colors.borderButton}}
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary} />
                <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>TU RESEÑA</Text>
              </View>
              <Text className="leading-relaxed italic" style={{ color: colors.primaryText }}>
                {bookResource.reseña || 'Sin reseña...'}
              </Text>
            </View>

            {/* CARD 4: Fecha Inicio (48% width) */}
            <View 
              className="w-[48%] p-4 rounded-2xl space-y-2"
              style={{ backgroundColor: colors.surfaceButton }}
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} />
                <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>INICIO</Text>
              </View>
              <View>
                <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                  {bookResource.fechaInicio ? new Date(bookResource.fechaInicio).toLocaleDateString() : '-'}
                </Text>
              </View>
            </View>
            {/* CARD 5: Fecha Fin (48% width) */}
            <View 
              className="w-[48%] p-4 rounded-2xl space-y-2"
              style={{ backgroundColor: colors.surfaceButton }}
            >
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="calendar-end" size={20} color={colors.primary} />
                <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.secondaryText }}>FIN</Text>
              </View>
              <View>
                <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                  {bookResource.fechaFin ? new Date(bookResource.fechaFin).toLocaleDateString() : '-'}
                </Text>
              </View>
            </View>

          </View>

          {/* === NUEVA TARJETA: TIEMPO DE LECTURA === */}
          {readingTime && (
            <View className="mt-4">
              <View 
                className="rounded-2xl p-6 flex-row items-center justify-between shadow-lg" 
                style={{ backgroundColor: colors.accent }}
              >
                <View>
                  <Text className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: colors.primaryText }}>
                    Tiempo de lectura total
                  </Text>
                  <Text className="text-2xl font-bold" style={{ color: colors.primaryText }}>
                    {readingTime}
                  </Text>
                </View>
                <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: `${colors.primaryText}33` }}>
                  <MaterialCommunityIcons name="timer-outline" size={24} color={colors.primaryText} />
                </View>
              </View>
            </View>
          )}



          {/*
          <View className="gap-4 mb-6">
            {/* Tu calificación 
            {bookResource.calificacion > 0 && (
              <View className="p-4 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-bold mb-2 uppercase" style={{ color: colors.title }}>
                  Tu calificación
                </Text>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome5
                      key={star}
                      name="star"
                      size={20}
                      color={star <= bookResource.calificacion ? colors.rating : colors.secondaryText}
                      solid={star <= bookResource.calificacion}
                      style={{ marginRight: 4 }}
                    />
                  ))}
                </View>
              </View>
            )}


            {/* Páginas leídas 
            {bookResource.paginasLeidas > 0 && (
              <View className="p-4 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-bold mb-2 uppercase" style={{ color: colors.title }}>
                  Páginas leídas
                </Text>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="book-open-page-variant" size={24} color={colors.primary} />
                  <Text className="text-lg font-bold ml-2" style={{ color: colors.primaryText }}>
                    {bookResource.paginasLeidas} páginas
                  </Text>
                </View>
              </View>
            )}

            {/* Fechas de lectura 
            {(bookResource.fechaInicio || bookResource.fechaFin) && (
              <View className="p-4 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-bold mb-3 uppercase" style={{ color: colors.title }}>
                  Periodo de lectura
                </Text>
                <View className="gap-2">
                  {bookResource.fechaInicio && (
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="calendar-start" size={20} color={colors.primary} />
                      <Text className="text-sm ml-2 mr-2" style={{ color: colors.secondaryText }}>Inicio:</Text>
                      <Text className="text-sm font-semibold" style={{ color: colors.primaryText }}>
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
                      <Text className="text-sm ml-2 mr-2" style={{ color: colors.secondaryText }}>Fin:</Text>
                      <Text className="text-sm font-semibold" style={{ color: colors.primaryText }}>
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

            {/* Tu reseña 
            {bookResource.reseña && (
              <View className="p-4 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
                <Text className="text-sm font-bold mb-2 uppercase" style={{ color: colors.title }}>
                  Tu reseña
                </Text>
                <Text className="text-base leading-6" style={{ color: colors.primaryText }}>
                  {bookResource.reseña}
                </Text>
              </View>
            )}

            {/* Fecha de agregado 
            <View className="p-4 rounded-xl" style={{backgroundColor: colors.surfaceButton}}>
              <Text className="text-sm font-bold mb-2 uppercase" style={{ color: colors.title }}>
                Agregado a tu colección
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="calendar-plus" size={20} color={colors.primary} />
                <Text className="text-base ml-2" style={{ color: colors.primaryText }}>
                  {new Date(bookResource.fechacreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </View>
          */}
        </View>
      </ScrollView>
    </Screen>
  );
}

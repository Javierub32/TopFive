import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { View, Text, Image, Pressable, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity } from '../hooks/useActivity';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon } from 'components/Icons';
import { router } from 'expo-router';
import { ResourceType } from 'hooks/useResource';
import { useState } from 'react';

export default function ActivityItem({ item }: { item: Activity }) {
  const { colors } = useTheme();

  const getRelativeTime = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    //if (diffInSeconds < 60) return 'Ahora mismo';             
    const minutes = Math.floor(diffInSeconds / 60);
    //if (minutes < 60) return minutes === 1 ? `Hace 1 minuto` : `Hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    //if (hours < 24) return hours === 1 ? `Hace 1 hora` : `Hace ${hours} horas`;
    if(hours < 24) return "Hoy";                                                //CUANDO FUNCIONE BIEN DESCOMENTAR LAS DE ARRIBA Y BORRAR ESTA LINEA
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? `Hace 1 día` : `Hace ${days} días`;
    return then.toLocaleDateString(); // Si es más de una semana, mostrar fecha completa
  };

  const categoryMap: Record<string, { color: any; icon: any; resourceType: ResourceType }> = {
    LIBRO: { color: colors.ground1, icon: BookIcon, resourceType: 'libro' },
    PELICULA: { color: colors.ground2, icon: FilmIcon, resourceType: 'pelicula' },
    SERIE: { color: colors.ground3, icon: ShowIcon, resourceType: 'serie' },
    VIDEOJUEGO: { color: colors.ground4, icon: GameIcon, resourceType: 'videojuego' },
    CANCION: { color: colors.ground5, icon: MusicIcon, resourceType: 'cancion' },
  };

  const rating = item.calificacion || 0;

  const typeMap: Record<ResourceType, string> = {
    libro: 'book',
    pelicula: 'film',
    serie: 'series',
    videojuego: 'game',
    cancion: 'song',
  };

  const type = typeMap[categoryMap[item.tipo_contenido].resourceType];

  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 120;
  const shouldTruncate = item.comentario && item.comentario.length > MAX_LENGTH;
  const descriptionText = item.comentario || '';

  const displayedDescription =
    shouldTruncate && !isExpanded ? descriptionText.slice(0, MAX_LENGTH) + '...' : descriptionText;

  return (
    <View
      className=" mb-4 overflow-hidden rounded-2xl shadow-xl"
      style={{ borderWidth: 0, borderColor: colors.borderButton }}>
      {/* Imagen de fonde */}
      <ImageBackground
        source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', backgroundColor: colors.surfaceButton }}
        imageStyle={{ opacity: 0.2 }}>
        {/* Gradiente */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', colors.surfaceButton]}
          locations={[0, 0.6]}
          style={{ width: '100%' }}>
          {/* Tipo del recurso */}
          <View className="p-4">
            <View
              className="rounded-full"
              style={{
                alignSelf: 'flex-start',
                backgroundColor: `${categoryMap[item.tipo_contenido].color}33`,
                paddingHorizontal: 12,
                padding: 4,
                marginBottom: 30,
              }}>
              {(() => {
                const IconComponent = categoryMap[item.tipo_contenido].icon;
                return IconComponent ? (
                  <IconComponent
                    size={18}
                    color={categoryMap[item.tipo_contenido].color}
                    style={{ padding: 4 }}
                  />
                ) : null;
              })()}
            </View>

            {/* Contenido del recurso */}
            <View className="flex-row gap-4">
              {/* Poster con Badge de Año */}
              <TouchableOpacity
                className="relative items-center justify-start"
                onPress={() => {
                  router.push({
                    pathname: `/details/${type}/${type}Content`,
                    params: { from: 'home', id: item.idapi },
                  });
                }}>
                {item.tipo_contenido === 'CANCION' ? (
                  <Image
                    source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
                    className="h-28 w-28 rounded-xl"
                    style={{ borderWidth: 0, borderColor: colors.borderButton }}
                  />
                ) : (
                  <Image
                    source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
                    className="h-36 w-24 rounded-xl"
                    style={{ borderWidth: 0, borderColor: colors.borderButton }}
                  />
                )}
              </TouchableOpacity>

              {/* Detalles del Recurso */}
              <View className="flex-1 flex-col ">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text
                      className="mb-2 mr-2 text-base font-bold leading-tight"
                      style={{ color: colors.primaryText }}>
                      {item.titulo}
                    </Text>
                    {/* Calificación */}
                    {rating > 0 && (
                      <View className="mt-0 flex-row items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = item.calificacion || 0;
                          let iconName: any = 'star';
                          let isSolid = true;

                          if (rating >= star) {
                            iconName = 'star';
                            isSolid = true;
                          } else if (rating >= star - 0.5) {
                            iconName = 'star-half-alt'; // Nombre del icono de media estrella en MaterialCommunityIcons
                            isSolid = true;
                          } else {
                            iconName = 'star';
                            isSolid = false;
                          }

                          return (
                            <FontAwesome5
                              key={star}
                              name={iconName}
                              solid={isSolid}
                              size={12}
                              color={rating >= star - 0.5 ? colors.rating : colors.secondaryText}
                            />
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
                {/* Reseña */}
                <Text style={{ color: colors.secondaryText }} className="mt-2">
                  <Text className="text-xs leading-relaxed ">{displayedDescription}</Text>
                  {shouldTruncate && (
                    <Text
                      className="text-xs font-bold"
                      style={{ color: colors.primary }}
                      onPress={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? ' Leer menos' : 'Leer más'}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
          {/* Línea separadora */}
          <View className="mx-2 h-[1px] " style={{ backgroundColor: colors.placeholderText }} />
        </LinearGradient>

        {/* Header: Usuario e info */}
        <View className="p-4" style={{ backgroundColor: colors.surfaceButton }}>
          <View className="flex-row items-center gap-3">
            {item.avatar_url ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: 'details/user/',
                    params: { username: item.username },
                  })
                }>
                <Image
                  source={{ uri: item.avatar_url }}
                  className="h-10 w-10 rounded-full"
                  style={{ borderWidth: 0, borderColor: colors.borderButton }}
                />
              </Pressable>
            ) : (
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  borderWidth: 0,
                  borderColor: colors.borderButton,
                }}>
                <Text
                  onPress={() =>
                    router.push({
                      pathname: 'details/user/',
                      params: { username: item.username },
                    })
                  }
                  className="text-xl font-bold"
                  style={{ color: colors.primaryText }}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View className="flex-col">
              <Text>
                <Text
                  onPress={() =>
                    router.push({
                      pathname: 'details/user/',
                      params: { username: item.username },
                    })
                  }
                  className="text-base font-bold"
                  style={{ color: colors.primaryText }}>
                  {item.username}{' '}
                </Text>
                <Text className="text-xs" style={{ color: colors.secondaryText }}>
                  {getRelativeTime(item.fecha_actividad)}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

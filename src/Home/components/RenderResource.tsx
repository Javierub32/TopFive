import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import {
  View,
  Image,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity } from '../hooks/useActivity';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon } from 'components/Icons';
import { router } from 'expo-router';
import { ResourceType } from 'hooks/useResource';
import { useState } from 'react';
import { AppText } from 'components/AppText';
import RenderHtml from 'react-native-render-html';
import { useFontSize } from 'context/FontSizeContext';
import { useTranslation } from 'react-i18next';

export default function ActivityItem({ item, onPress }: { item: Activity; onPress: () => void }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { fontSizeMultiplier } = useFontSize();
  const { t } = useTranslation();

  const getRelativeTime = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    //if (diffInSeconds < 60) return 'Ahora mismo';
    const minutes = Math.floor(diffInSeconds / 60);
    //if (minutes < 60) return minutes === 1 ? `Hace 1 minuto` : `Hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    //if (hours < 24) return hours === 1 ? `Hace 1 hora` : `Hace ${hours} horas`;
    if (hours < 24) return t('home.renderResource.today'); //CUANDO FUNCIONE BIEN DESCOMENTAR LAS DE ARRIBA Y BORRAR ESTA LINEA
    const days = Math.floor(hours / 24);
    if (days < 7)
      return days === 1
        ? t('home.renderResource.oneDayAgo')
        : t('home.renderResource.daysAgo', { days });
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

  const plainTextLength = (item.comentario || '').replace(/<[^>]*>?/gm, '').length;
  const shouldTruncate = plainTextLength > MAX_LENGTH;

  const displayedDescription =
    shouldTruncate && !isExpanded
      ? item.comentario?.substring(0, MAX_LENGTH) + '...'
      : item.comentario || '';

  const tagsStyles = {
    body: {
      color: colors.secondaryText,
      fontSize: 14 * fontSizeMultiplier,
      lineHeight: 20 * fontSizeMultiplier,
    },
    p: { margin: 0 },
    b: { fontWeight: 'bold' },
    i: { fontStyle: 'italic' },
    ul: { marginVertical: 2 },
    ol: { marginVertical: 2 },
  };

  return (
    <TouchableOpacity
	  onPress={onPress}
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
                    <AppText
                      className="mb-2 mr-2 text-base font-bold leading-tight"
                      style={{ color: colors.primaryText }}>
                      {item.titulo}
                    </AppText>
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
                <View className="mt-2">
                  <RenderHtml
                    contentWidth={width - 160} // Ajuste del ancho para tener en cuenta la imagen y los márgenes
                    source={{ html: displayedDescription }}
                    tagsStyles={tagsStyles as any}
                  />
                  {shouldTruncate && (
                    <AppText
                      className="mt-1 text-xs font-bold"
                      style={{ color: colors.primary }}
                      onPress={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? t('common.readLess') : t('common.readMore')}
                    </AppText>
                  )}
                </View>
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
                <AppText
                  onPress={() =>
                    router.push({
                      pathname: 'details/user/',
                      params: { username: item.username },
                    })
                  }
                  className="text-xl font-bold"
                  style={{ color: colors.primaryText }}>
                  {item.username.charAt(0).toUpperCase()}
                </AppText>
              </View>
            )}

            <View className="flex-col">
              <AppText>
                <AppText
                  onPress={() =>
                    router.push({
                      pathname: 'details/user/',
                      params: { username: item.username },
                    })
                  }
                  className="text-base font-bold"
                  style={{ color: colors.primaryText }}>
                  {item.username}{' '}
                </AppText>
                <AppText className="text-xs" style={{ color: colors.secondaryText }}>
                  {getRelativeTime(item.fecha_actividad)}
                </AppText>
              </AppText>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

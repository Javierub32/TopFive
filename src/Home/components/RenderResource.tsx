import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import React from 'react';
import { View, Text, Image, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity } from '../hooks/useActivity';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, RatingStarIcon, ShowIcon, UserIcon } from 'components/Icons';
import { router } from 'expo-router';



export default function ActivityItem({ item }: { item: Activity }) {
  const { colors } = useTheme();

  const getRelativeTime = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora mismo';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return minutes == 1 ? `Hace 1 minuto` : `Hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours == 1 ? `Hace 1 hora` : `Hace ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days == 1 ? `Hace 1 día` : `Hace ${days} días`;
    return then.toLocaleDateString(); // Si es más de una semana, mostrar fecha completa
  };

  const categoryMap: Record<string, {color: any, icon: any}> = {
    LIBRO: {color: colors.ground1, icon: BookIcon},
    PELICULA: {color: colors.ground2, icon: FilmIcon},
    SERIE: {color: colors.ground3, icon: ShowIcon},
    VIDEOJUEGO: {color: colors.ground4, icon: GameIcon},
    CANCION: {color: colors.ground5, icon: MusicIcon}
  };

  const rating = item.calificacion || 0;

  return (
    <View className=" rounded-2xl shadow-xl mb-4 overflow-hidden" style={{ borderWidth: 0, borderColor: colors.borderButton }}>
      {/* Imagen de fonde */}
      <ImageBackground
        source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', backgroundColor: colors.surfaceButton }}
        imageStyle={{ opacity: 0.2 }}
      >
        {/* Gradiente */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', colors.surfaceButton]}
          locations={[0, 0.6]}
          style={{ width: '100%' }}
        >
          {/* Tipo del recurso */}
          <View className="p-4">
            <View className="rounded-full" style={{ alignSelf: 'flex-start', backgroundColor: `${categoryMap[item.tipo_contenido].color}33`, paddingHorizontal: 12, padding: 4, marginBottom: 30 }}>
              {(()=> {
                const IconComponent = categoryMap[item.tipo_contenido].icon;
                return IconComponent ? (
                  <IconComponent size={18} color={categoryMap[item.tipo_contenido].color} style={{padding: 4}} />
                ) : null;
              })()}
            </View>

            {/* Contenido del recurso */}
            <View className="flex-row gap-4">
              {/* Poster con Badge de Año */}
              <View className="relative items-center justify-center">
                <Image
                  source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
                  className="w-24 h-36 rounded-xl"
                  style={{ borderWidth: 0, borderColor: colors.borderButton }}
                />
              </View>

              {/* Detalles del Recurso */}
              <View className="flex-col flex-1">
                <View className="flex-row justify-between items-start">
                  <View className='flex-1'>
                    <Text className="font-bold text-base leading-tight mr-2 mb-2" style={{ color: colors.primaryText }}>{item.titulo}</Text>
                    {/* Calificación */}
                    {rating > 0 && (
                      <View className="flex-row items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = item.calificacion || 0;
                          let iconName: any = "star";

                          if (rating >= star) {
                            iconName = "star";
                          } else if (rating >= star - 0.5) {
                            iconName = "star-half-full"; // Nombre del icono de media estrella en MaterialCommunityIcons
                          } else {
                            iconName = "star";
                          }

                          return (
                            <RatingStarIcon
                              key={star}
                              name={iconName}
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
                <Text className="mt-3 text-sm leading-relaxed italic" numberOfLines={4} style={{ color: colors.secondaryText }}>
                  {item.comentario || '--Sin reseña--'}
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
              <Pressable onPress={() => router.push({
                pathname: 'details/user/',
                params: { username: item.username }
              })}>
                <Image
                  source={{ uri: item.avatar_url }}
                  className="w-10 h-10 rounded-full"
                  style={{ borderWidth: 0, borderColor: colors.borderButton }}
                />
              </Pressable>
            ) : (
              <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary, borderWidth: 0, borderColor: colors.borderButton }}>
                <Text
                  onPress={() => router.push({
                    pathname: 'details/user/',
                    params: { username: item.username }
                  })}
                  className="text-xl font-bold" style={{ color: colors.primaryText }}>{item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View className="flex-col">
              <Text>
                <Text
                  onPress={() => router.push({
                    pathname: 'details/user/',
                    params: { username: item.username }
                  })}
                  className="font-bold text-base" style={{ color: colors.primaryText }}>{item.username}  </Text>
                <Text className="text-xs" style={{ color: colors.secondaryText }}>{getRelativeTime(item.fecha_actividad)}</Text>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { View, Text, Pressable, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTopFive } from '../hooks/useTopFive';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useRouter } from 'expo-router';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';

const categories: { type: ResourceType; label: string; icon: any }[] = [
  { type: 'libro', label: 'Libro', icon: BookIcon },
  { type: 'pelicula', label: 'Película', icon: FilmIcon },
  { type: 'serie', label: 'Serie', icon: ShowIcon },
  { type: 'videojuego', label: 'Videojuego', icon: GameIcon },
  { type: 'cancion', label: 'Canción', icon: MusicIcon },
];

export const TopFiveSelector = () => {
  const slots = Array.from({ length: 5 });
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    topFiveItems,
    loading,
    handlePress,
    handleCategorySelect,
    modalVisible,
    setModalVisible,
  } = useTopFive(user?.id || '');

  if (loading) {
    return (
      <View className="flex items-center justify-center">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View className="z-50 mb-4">
      <Text className="mb-2 text-lg font-bold" style={{ color: colors.primaryText }}>
        Mi Top 5
      </Text>

      {/* Grid de Slots */}
      <View className="flex-row gap-2">
        {slots.map((_, index) => {
          const position = index + 1;
          const item = topFiveItems?.find((i: any) => i.posicion === position);
          const imageUrl = item?.resourceData?.contenido?.imagenUrl;

          if (!item) {
            return (
              <View
                key={index}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}>
                <Pressable
                  onPress={() => handlePress(position, item)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                  <View
                    className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg border"
                    style={{
                      backgroundColor: colors.surfaceButton,
                      borderColor: colors.borderButton,
                    }}>
                    <Text className="text-xl" style={{ color: colors.secondaryText }}>
                      +
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          }

          return (
            <View
              key={index}
              className="flex-1 rounded-lg"
              style={{ backgroundColor: colors.surfaceButton }}>
              <Pressable
                onPress={() => handlePress(position, item)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                <View
                  className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg border"
                  style={{
                    backgroundColor: colors.surfaceButton,
                    borderColor: colors.borderButton,
                  }}>
                  <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>

      {modalVisible && (
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 999,
              backgroundColor: 'rgba(0,0,0,0.7)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          onPress={() => setModalVisible(false)} 
        >

          <Pressable
            className="w-[80%] rounded-2xl border p-4 shadow-xl"
            style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}
            onPress={(e) => e.stopPropagation()} // Evita cerrar al tocar dentro
          >
            <Text
              className="mb-4 text-center text-xl font-bold"
              style={{ color: colors.primaryText }}>
              Seleccionar Categoría
            </Text>

            <View className="gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.type}
                    className="flex-row items-center rounded-xl border p-3"
                    style={{ backgroundColor: colors.background, borderColor: colors.borderButton }}
                    onPress={() => handleCategorySelect(cat.type)}>
                    <View className="mr-3">
                      <Icon size={20} color={colors.secondaryText} />
                    </View>
                    <Text className="text-base font-semibold" style={{ color: colors.primaryText }}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              className="mt-4 items-center rounded-xl p-3"
              onPress={() => setModalVisible(false)}>
              <Text className="text-base font-bold" style={{ color: colors.error }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
};

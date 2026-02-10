import { useTheme } from 'context/ThemeContext';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { useRouter } from 'expo-router';

const categories: { type: ResourceType; label: string; icon: any }[] = [
  { type: 'libro', label: 'Libro', icon: BookIcon },
  { type: 'pelicula', label: 'Película', icon: FilmIcon },
  { type: 'serie', label: 'Serie', icon: ShowIcon },
  { type: 'videojuego', label: 'Videojuego', icon: GameIcon },
  { type: 'cancion', label: 'Canción', icon: MusicIcon },
];

interface CategorySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory?: (category: ResourceType, params?: any) => void;
  routePath?: string;
  params?: Record<string, any>;
  title?: string;
}

export const CategorySelectorModal = ({
  visible,
  onClose,
  onSelectCategory,
  routePath,
  params,
  title = 'Seleccionar Categoría',
}: CategorySelectorModalProps) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleCategoryPress = (categoryType: ResourceType) => {
    if (onSelectCategory) {
      onSelectCategory(categoryType, params);
    } else if (routePath) {
      router.push({
        pathname: routePath as any,
        params: { ...params, category: categoryType },
      });
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          className="w-[80%] rounded-2xl border p-4 shadow-xl"
          style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          <Text
            className="mb-4 text-center text-xl font-bold"
            style={{ color: colors.primaryText }}>
            {title}
          </Text>

          <View className="gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.type}
                  className="flex-row items-center rounded-xl border p-3"
                  style={{ backgroundColor: colors.background, borderColor: colors.borderButton }}
                  onPress={() => handleCategoryPress(cat.type)}>
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
            onPress={onClose}>
            <Text className="text-base font-bold" style={{ color: colors.error }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

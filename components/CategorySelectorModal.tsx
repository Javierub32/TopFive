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
}

export const CategorySelectorModal = ({
  visible,
  onClose,
  onSelectCategory,
  routePath,
  params,
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
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          className="w-[100%] rounded-xl p-4 shadow-xl"
          style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          <Text
            className="mb-4 text-center text-xl font-bold"
            style={{ color: colors.primaryText }}>
            {'¿Qué quieres añadir?'}
          </Text>

          <View className="flex-row justify-around items-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.type}
                  className="items-center"
                  onPress={() => handleCategoryPress(cat.type)}>
                  <View 
                    className="w-14 h-14 rounded-full items-center justify-center mb-2 "
                    style={{ backgroundColor: `${colors[`ground${categories.indexOf(cat) + 1}`]}26`, borderWidth: 0 }}>
                    <Icon size={24} color={`${colors[`ground${categories.indexOf(cat) + 1}`]}FF`} />
                  </View>
                  <Text className="text-xs text-center" style={{ color: colors.primaryText }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className="mt-6 items-center rounded-xl p-3"
            onPress={onClose}
            style={{ backgroundColor: colors.background }}>
            <Text className="text-base font-bold" style={{ color: colors.error }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

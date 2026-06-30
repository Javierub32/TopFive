import { useTheme } from 'context/ThemeContext';
import { View, TouchableOpacity, Modal } from 'react-native';
import { BookIcon, FilmIcon, GameIcon, MusicIcon, ShowIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { useRouter } from 'expo-router';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
const categories: { type: ResourceType; labelKey: string; icon: any }[] = [
  { type: 'libro', labelKey: 'category.book', icon: BookIcon },
  { type: 'serie', labelKey: 'category.serie', icon: ShowIcon },
  { type: 'pelicula', labelKey: 'category.film', icon: FilmIcon },
  { type: 'videojuego', labelKey: 'category.videogame', icon: GameIcon },
  { type: 'cancion', labelKey: 'category.album', icon: MusicIcon },
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
  const { t } = useTranslation();

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
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
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
          className="w-[100%] rounded-xl p-4 shadow-xl "
          style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          <AppText
            className="mb-4 text-center font-bold"
            style={{ color: colors.primaryText, fontSize: 20 }}>
            {t('components.whatToAdd')}
          </AppText>

          <View className="flex-row items-center justify-around">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.type}
                  className="items-center"
                  onPress={() => handleCategoryPress(cat.type)}>
                  <View
                    className="mb-2 h-14 w-14 items-center justify-center rounded-full "
                    style={{
                      backgroundColor: `${colors[`ground${categories.indexOf(cat) + 1}`]}26`,
                      borderWidth: 0,
                    }}>
                    <Icon size={24} color={`${colors[`ground${categories.indexOf(cat) + 1}`]}FF`} />
                  </View>
                  <AppText
                    className="mb-10 text-center"
                    style={{ color: colors.primaryText, fontSize: 12 }}>
                    {t(cat.labelKey as any)}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

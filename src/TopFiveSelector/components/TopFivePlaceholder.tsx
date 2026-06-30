import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { ResourceType } from 'hooks/useResource';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  category: ResourceType;
  loading: boolean;
}

export const TopFivePlaceholder = ({ category, loading }: Props) => {
  const { t } = useTranslation();

  const CATEGORY_LABELS: Record<ResourceType, string> = {
    libro: t('categories.books'),
    pelicula: t('categories.films'),
    serie: t('categories.series'),
    videojuego: t('categories.videogames'),
    cancion: t('categories.albums'),
  };

  const categoryLabel = CATEGORY_LABELS[category] || t('common.content');
  const { colors } = useTheme();

  return (
    <View
      className={`absolute bottom-0 left-0 right-0 top-0 flex-1 items-center justify-center px-2 ${loading ? 'hidden' : ''}`}>
      {/* Texto Principal (Nombre de la categoría) */}
      <AppText
        className="mb-3 text-center font-bold"
        style={{ color: colors.primaryText, fontSize: 24 }}>
        {t('topFiveSelector.noContentDescription', { category: categoryLabel.toLowerCase() })}
      </AppText>

      {/* Texto Secundario (Instrucciones) */}
      <AppText
        className="mb-3 px-4 text-center"
        style={{ color: colors.secondaryText, fontSize: 14 }}>
        {t('topFiveSelector.noContentDescription')}
      </AppText>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/Add', params: { initialCategory: category } })}
        className="rounded-3xl px-6 py-3"
        style={{ backgroundColor: `${colors.primary}CC` }}>
        <AppText
          className="text-base font-bold"
          style={{ color: colors.primaryText, fontSize: 14 }}>
          {t('topFiveSelector.searchButton')}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

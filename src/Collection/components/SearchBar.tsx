import { View, TouchableOpacity } from 'react-native';
import { useCollection } from 'context/CollectionContext';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';
import { SearchIcon } from 'components/Icons';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';

export const resourceTypeMap: Record<ResourceType, string> = {
  pelicula: 'categories.films',
  serie: 'categories.series',
  videojuego: 'categories.videogames',
  libro: 'categories.books',
  cancion: 'categories.albums',
} as const satisfies Record<ResourceType, string>;

export const categoryToResourceMap: Record<string, ResourceType> = {
  Libros: 'libro',
  Películas: 'pelicula',
  Series: 'serie',
  Videojuegos: 'videojuego',
  Canciones: 'cancion',
};

export const SearchBar = () => {
  const { inputBusqueda, setInputBusqueda, handleSearch, categoriaActual } = useCollection();
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View className="relative z-50 mb-3">
      <View
        className="h-14 flex-row items-center rounded-lg border shadow-lg"
        style={{
          borderColor: colors.accent,
          backgroundColor: colors.surfaceButton,
          shadowColor: colors.shadow,
        }}>
        {/* Icono Lupa */}
        <TouchableOpacity
          className="justify-center py-2 pl-3"
          onPress={handleSearch}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <SearchIcon color={colors.secondaryText} size={24} />
        </TouchableOpacity>

        <AppTextInput
          className="h-full flex-1 overflow-hidden px-3 text-base text-primaryText"
          style={{ color: colors.primaryText, lineHeight: 17, fontSize: 14 }}
          placeholder={`${t('collection.searchInPlaceholder', { category: t(resourceTypeMap[categoriaActual as ResourceType] as any) })}`}
          placeholderTextColor={colors.placeholderText}
          value={inputBusqueda}
          onChangeText={setInputBusqueda}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

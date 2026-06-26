import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, SearchIcon } from 'components/Icons';
import { ResourceType } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  selectedCategory: ResourceType;
  onCategoryChange: (category: ResourceType) => void;
  menuAbierto: boolean;
  setMenuAbierto: (abierto: boolean) => void;
}

const OPCIONES: ResourceType[] = ['libro', 'pelicula', 'serie', 'videojuego', 'cancion'];

const CATEGORY_LABELS: Record<ResourceType, string> = {
  libro: 'categories.books',
  pelicula: 'categories.films',
  serie: 'categories.series',
  videojuego: 'categories.videogames',
  cancion: 'categories.albums',
} as const satisfies Record<ResourceType, string>;

export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  selectedCategory,
  onCategoryChange,
  menuAbierto,
  setMenuAbierto,
}: SearchBarProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const categoryLabel =
    t(CATEGORY_LABELS[selectedCategory] as any) || t('common.content').toLowerCase();

  return (
    <View className="relative z-50">
      <View
        className="h-14 flex-row items-center rounded-lg border shadow-lg"
        style={{ borderColor: colors.accent, backgroundColor: colors.surfaceButton }}>
        {/* Icono Lupa */}
        <TouchableOpacity
          className="justify-center py-2 pl-3"
          onPress={() => onSearch()}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <SearchIcon color={colors.secondaryText} />
        </TouchableOpacity>

        {/* Input de texto */}
        <AppTextInput
          className="h-full flex-1 overflow-hidden px-3 text-base"
          style={{ color: colors.primaryText, lineHeight: 17, maxHeight: 17 }}
          placeholder={`${t('search.placeholder')} ${categoryLabel}...`}
          placeholderTextColor={colors.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSearch()}
          returnKeyType="search"
        />

        {/* Separador vertical */}
        <View className="h-6 w-[1px]" style={{ backgroundColor: colors.accent }} />

        {/* Botón Selector de Categoría */}
        <TouchableOpacity
          className="h-full flex-row items-center justify-center px-4"
          activeOpacity={0.7}
          onPress={() => setMenuAbierto(!menuAbierto)}>
          <View className="max-w-[80px]">
            <AppText
              className="mr-1 font-medium"
              style={{ color: colors.secondaryText }}
              numberOfLines={1}>
              {t(CATEGORY_LABELS[selectedCategory] as any)}
            </AppText>
          </View>
          <MaterialCommunityIcons
            name={menuAbierto ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Menú Desplegable */}
      {menuAbierto && (
        <View
          className="absolute right-0 top-14 z-50 w-48 overflow-hidden rounded-lg border shadow-xl"
          style={{ borderColor: colors.accent, backgroundColor: colors.surfaceButton }}>
          {OPCIONES.map((opcion, index) => (
            <TouchableOpacity
              key={opcion}
              className="flex-row items-center justify-between p-3"
              style={{
                borderBottomWidth: index !== OPCIONES.length - 1 ? 1 : 0,
                borderBottomColor: colors.accent,
                backgroundColor: selectedCategory === opcion ? colors.accent : 'transparent',
              }}
              onPress={() => onCategoryChange(opcion)}>
              <AppText
                className="text-base"
                style={{
                  fontWeight: selectedCategory === opcion ? 'bold' : 'normal',
                  color: selectedCategory === opcion ? colors.primaryText : colors.secondaryText,
                }}>
                {t(CATEGORY_LABELS[opcion] as any)}
              </AppText>
              {selectedCategory === opcion && (
                <MaterialCommunityIcons name="check" size={16} color={colors.primaryText} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

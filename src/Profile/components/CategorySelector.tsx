import { ScrollView, Pressable, View, Text } from 'react-native';
import { CategoryKey } from '../hooks/useProfile';
import { iconAdapter } from '../adapters/iconAdapter';
import { useTheme } from 'context/ThemeContext';

interface Props {
  selected: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
}

const CATEGORIES: CategoryKey[] = ['libros', 'películas', 'series', 'videojuegos', 'canciones'];


export const CategorySelector = ({ selected, onSelect }: Props) => {
  const { colors } = useTheme();

  return (
    <View
      className="mb-4 flex-row justify-between"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.placeholderText }}
    >

      {CATEGORIES.map((cat) => {
        const IconComponent = iconAdapter.getIcon(cat);

        return(
          <Pressable key={cat} onPress={()=> onSelect(cat)}>
          <View className="px-6 py-2" style={selected === cat ? {borderBottomWidth: 4, borderBottomColor: colors.primary} : {}}>
            <IconComponent color={selected === cat ? colors.primary : colors.secondaryText} />
          </View>

        </Pressable>
        );
      })}
        
        
    </View>
  );
}
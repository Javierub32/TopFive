import { ScrollView, Pressable, View, Text } from 'react-native';
import { CategoryKey } from '../hooks/useProfile';
import { iconAdapter } from '../adapters/iconAdapter';
import { COLORS } from 'constants/colors';

interface Props {
  selected: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
}

const CATEGORIES: CategoryKey[] = ['libros', 'películas', 'series', 'canciones', 'videojuegos'];

export const CategorySelector = ({ selected, onSelect }: Props) => (
  <View
    className="mb-4 flex-row justify-between"
    style={{ borderBottomWidth: 1, borderBottomColor: '#374151' }}
  >

    {CATEGORIES.map((cat) => {
      const IconComponent = iconAdapter.getIcon(cat);

      return(
        <Pressable key={cat} onPress={()=> onSelect(cat)}>
        <View className={`px-6 py-2 ${selected === cat ? 'border-b-4 border-primary':''}`}>
          <IconComponent color={selected === cat ? COLORS.primary : COLORS.secondaryText} />
        </View>

      </Pressable>
      );
    })}
      
      
  </View>
);
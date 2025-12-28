import { ScrollView, Pressable, View, Text } from 'react-native';
import { CategoryKey } from '../hooks/useProfile';

interface Props {
  selected: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
}

const CATEGORIES: CategoryKey[] = ['libros', 'películas', 'series', 'canciones', 'videojuegos'];

export const CategorySelector = ({ selected, onSelect }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="mb-4"
    style={{ borderBottomWidth: 1, borderBottomColor: '#374151' }}
  >
    {CATEGORIES.map((cat) => (
      <Pressable key={cat} onPress={() => onSelect(cat)}>
        <View className={`px-4 py-2 ${selected === cat ? 'border-b-4 border-purple-500' : ''}`}>
          <Text className={`text-center capitalize ${selected === cat ? 'font-bold text-purple-500' : 'text-gray-500'}`}>
            {cat}
          </Text>
        </View>
      </Pressable>
    ))}
  </ScrollView>
);
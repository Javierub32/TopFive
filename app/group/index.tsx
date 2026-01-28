import { View, Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { Screen } from 'components/Screen'; 
import { useCollection } from '@/Collection/hooks/useCollection';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useGroupData } from 'src/Collection/hooks/useGroupData';

export default function GroupScreen() {
  const params = useLocalSearchParams();
  const title = params.title as string;
  const type = params.type as string;
  const category = params.category as string;

  const { handleItemPress } = useCollection();
  const { loading, dataToShow } = useGroupData(category, type as any);

  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-primaryText mb-4">{title}</Text>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={dataToShow}
            categoriaActual={category}
            handleItemPress={handleItemPress}
          />
        )}
      </View>
    </Screen>
  );
}
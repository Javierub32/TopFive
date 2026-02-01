import { View, Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { Screen } from 'components/Screen'; 
import { useCollection } from '@/Collection/hooks/useCollection';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useGroupData } from 'src/Collection/hooks/useGroupData';
import { ReturnButton } from 'components/ReturnButton';

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
        <ReturnButton route="/Collection" title={title} style={" "} params={{initialResource: category}}/>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={dataToShow}
            categoriaActual={category}
            handleItemPress={handleItemPress}
			showStatus={false}
          />
        )}
      </View>
    </Screen>
  );
}
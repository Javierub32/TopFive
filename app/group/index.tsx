import { View, Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { Screen } from 'components/Screen'; 
import { useCollection } from 'context/CollectionContext';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useGroupData } from 'src/Collection/hooks/useGroupData';
import { ReturnButton } from 'components/ReturnButton';
import { useEffect } from 'react';

export default function GroupScreen() {
  const params = useLocalSearchParams();
  const title = params.title as string;
  const state = params.state as string;
  const category = params.category as string;

  const { handleItemPress, setIsSearchVisible } = useCollection();
  const { loading, data } = useGroupData(category, state as any);

  useEffect(() => {
		setIsSearchVisible(false);
  }, []);
  
  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <ReturnButton route="/Collection" title={title} style={" "} params={{initialResource: category}}/>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={data}
            categoriaActual={category}
            handleItemPress={handleItemPress}
			showStatus={false}
          />
        )}
      </View>
    </Screen>
  );
}
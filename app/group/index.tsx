import { View, Text} from 'react-native';
import { useLocalSearchParams } from 'expo-router'; 
import { Screen } from 'components/Screen'; 
import { useCollection } from 'context/CollectionContext';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { useGroupData } from 'src/Collection/hooks/useGroupData';
import { ReturnButton } from 'components/ReturnButton';
import { useEffect } from 'react';
import { ResourceType, StateType } from 'hooks/useResource';

const stateMap: Record<string, StateType> = {
	enCurso: 'EN_CURSO',
	pendientes: 'PENDIENTE',
	completados: 'COMPLETADO',
};

export default function GroupScreen() {
  const params = useLocalSearchParams();
  const title = params.title as string;
  const state = params.state as string;
  const category = params.category as string;

  const { handleItemPress, setIsSearchVisible } = useCollection();
  const { loading, data, handleLoadMore } = useGroupData(category as ResourceType, stateMap[state]);

  useEffect(() => {
		setIsSearchVisible(false);
  }, []);
  
  return (
    <Screen>
      <View className="flex-1 px-4 pt-4">
        <ReturnButton route="/Collection" title={title} style={" "} params={{initialResource: category as ResourceType }}/>
        {loading && data.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <CollectionStructure
            data={data}
            categoriaActual={category}
            handleItemPress={handleItemPress}
			showStatus={false}
			handleSearchPagination={handleLoadMore}
			loading={loading}
          />
        )}
      </View>
    </Screen>
  );
}
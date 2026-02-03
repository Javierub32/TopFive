import { View, Text, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';

import { useCollection } from 'src/Collection/hooks/useCollection';
import { SearchBar } from 'src/Collection/components/SearchBar';
import { FilterPanel } from 'src/Collection/components/FilterPanel';
import { RenderCollection } from 'src/Collection/components/RenderCollection';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CollectionStructure } from 'components/CollectionStructure';
import { filterCollectionData } from 'src/Collection/adapters/filterCollectionData';
import NavigableCollectionScreen from 'app/borrar/a';
import ResourceList from 'app/borrar/ResourceList';
import { CollectionProvider } from 'context/CollectionContext';

export default function CollectionScreen() {
  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Mi Biblioteca</Text>

        <SearchBar/>

		{//<NavigableCollectionScreen />*/}
}
		
        <ResourceList/>
      </View>
    </Screen>
  );
}
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { SearchBar } from 'src/Collection/components/SearchBar';
import ResourceList from '@/Collection/components/ResourceList';
import { useNavigable } from '@/Collection/hooks/useNavigable';
import { SceneMap, TabView } from 'react-native-tab-view';
import Lists from '@/Collection/components/Lists';
import { CancelIcon2, SearchIcon } from 'components/Icons';
import renderTabBar from '@/Collection/components/TabBar';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';
import Animated, {FadeInUp,  LinearTransition, } from 'react-native-reanimated';


const renderScene = SceneMap({
  resources: ResourceList,
  lists: Lists,
});

export default function CollectionScreen() {
  const { layout, index, setIndex, routes } = useNavigable();
  const { isSearchVisible, toggleSearch } = useCollection();
  const { colors } = useTheme();

  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
            Mi Biblioteca
          </Text>

          <TouchableOpacity
            onPress={toggleSearch}
            className="rounded-full p-2">
            {isSearchVisible ? (
              <CancelIcon2 size={24} color={colors.primaryText} />
            ) : (
              <SearchIcon size={24} color={colors.primaryText} />
            )}
          </TouchableOpacity>
        </View>

        {isSearchVisible && (
            <Animated.View 
                entering={FadeInUp.duration(300).springify()}
                style={{ zIndex: 1 }}
            >
                <SearchBar/>
            </Animated.View>
        )}

        <Animated.View 
            layout={LinearTransition.springify()} 
            style={{ flex: 1 }}
        >
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={(props) => renderTabBar(props)}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                lazy
                style={{ flex: 1 }}
            />
        </Animated.View>
      </View>
    </Screen>
  );
}

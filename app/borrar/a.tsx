import { TabView, SceneMap } from 'react-native-tab-view';
import ResourceList from './ResourceList';
import Lists from './Lists';
import { useNavigable } from '@/Collection/hooks/useNavigable';
import renderTabBar from '@/Collection/components/TabBar';

const renderScene = SceneMap({
  resources: ResourceList,
  lists: Lists,
});

export default function NavigableCollectionScreen() {
  const { layout, index, setIndex, routes } = useNavigable();

  return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={(props) => renderTabBar(props)}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
		style={{ flex: 1 }}
      />
  );
}
import { View } from 'react-native';
import { TabBar, TabBarProps } from 'react-native-tab-view';
import { AppText } from 'components/AppText';
export default function renderTabBar(props: TabBarProps<any>, colors: any) {
  return (
    <View className="bg-transparent py-2">
      {/* Contenedor tipo pastilla */}
      <View className="overflow-hidden rounded-lg border border-borderButton bg-surfaceButton p-1 shadow-lg">
        <TabBar
          {...props}
          activeColor={'white'}
          inactiveColor={'#94a3b8'}
          indicatorStyle={{
            backgroundColor: colors.secondary,
            height: '100%',
            borderRadius: 6,
          }}
          style={{
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            height: 40,
          }}
          tabStyle={{
            minHeight: 40,
            padding: 0,
          }}
          renderLabel={({ route, focused }: any) => (
            <AppText
              style={{
                color: focused ? 'white' : '#94a3b8',
                fontWeight: '600',
                textAlign: 'center',
                width: '100%',
                fontSize: 14,
              }}>
              {route.title}
            </AppText>
          )}
          pressColor="transparent"
          {...({} as any)}
        />
      </View>
    </View>
  );
}

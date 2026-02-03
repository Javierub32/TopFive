import { useTheme } from "context/ThemeContext";
import { Text, View } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";

export default function renderTabBar(props: TabBarProps<any>) {
	const { colors } = useTheme();
	return (
		<View className="py-2 bg-transparent">
		  
		  {/* Contenedor tipo pastilla */}
		  <View className="rounded-lg border border-borderButton bg-surfaceButton overflow-hidden p-1 shadow-lg">
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
			<Text
			  style={{ 
				color: focused ? 'white' : '#94a3b8',
				fontWeight: '600',
				textAlign: 'center',
				width: '100%',
			  }}
			>
			  {route.title}
			</Text>
		  )}
		  pressColor="transparent"
		  {...({} as any)}
		/>
	  </View>
	</View>
  );
}
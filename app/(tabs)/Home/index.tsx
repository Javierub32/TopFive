import { View, Text, FlatList, RefreshControl} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';;
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';



export default function HomeScreen() {
	const { colors } = useTheme();
	const { activities, loading, refreshing, fetchActivities, refreshActivities } = useActivity();

	return (
		<Screen>
			<StatusBar style="light" />
			<View className="px-4 pt-6">
				<Text className="mb-4 text-3xl font-bold" style={{color: colors.primaryText}}>Inicio</Text>
			</View>
			{loading && activities.length === 0 ? (
				<LoadingIndicator />
			) : (
			<FlatList
				data={activities}
				keyExtractor={(item, index) => `${item.recurso_id}-${index}`}
				renderItem={({ item }) => <ActivityItem item={item} />}
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
				onEndReached={fetchActivities}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refreshActivities} tintColor={colors.primaryText} />	
				}
				ListFooterComponent={() => 
					loading ? <LoadingIndicator  /> : null
				}
			/>
			)}
		</Screen>
	);
}

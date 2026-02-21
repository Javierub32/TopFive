import { View, Text, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';;
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SearchIcon, SearchIcon2, SocialBubblesIcon } from 'components/Icons';
import { NotificationButton } from '@/Notifications/components/NotificationButton';



export default function HomeScreen() {
	const { colors } = useTheme();
	const { activities, loading, refreshing, fetchActivities, refreshActivities } = useActivity();

	return (
		<Screen>
			<StatusBar style="light" />
			<View className="flex px-4 py-6">
				<Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>
					Inicio
				</Text>

				<View className="absolute right-4 top-5 z-10 flex-row gap-x-2">
				<NotificationButton />
						<TouchableOpacity
							onPress={() => router.push('/(tabs)/Search')}
							className="rounded-full p-3"
							style={{ backgroundColor: `${colors.primaryText}30` }}
						>
							<SearchIcon2 size={24} color={colors.primaryText} />
						</TouchableOpacity>
				</View>
			</View>

			{loading && activities.length === 0 ? (
				<LoadingIndicator />
			) : (
			<FlatList
				data={activities}
				keyExtractor={(item, index) => `${item.recurso_id}-${index}`}
				renderItem={({ item }) => <ActivityItem item={item} />}
				contentContainerStyle={activities.length === 0 ? { flex: 1, paddingHorizontal: 16, paddingVertical: 150 } : { paddingHorizontal: 16, paddingBottom: 16 }}
				onEndReached={fetchActivities}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refreshActivities} tintColor={colors.primaryText} />	
				}
				ListEmptyComponent={() => (
					<View className="flex-1 items-center px-4 ">
						<SocialBubblesIcon className="mb-4" size={100} color={colors.primaryText} />
						<Text className="text-2xl text-center mb-4 font-bold" style={{color: colors.primaryText}}>
							No tienes ningún amigo con reseñas acabadas.
						</Text>
						<Text className="text-md text-center mb-6" style={{color: colors.primaryText}}>
							Agrega amigos para poder ver sus reseñas.
						</Text>
						<TouchableOpacity
							onPress={() => router.push('/(tabs)/Search')}
							className="px-6 py-3 rounded-3xl"
							style={{backgroundColor: colors.primary}}
						>
							<Text className="text-white text-base font-bold">Buscar amigos </Text>
							
						</TouchableOpacity>
					</View>
				)}
				ListFooterComponent={() => 
					loading ? <LoadingIndicator  /> : null
				}
				showsVerticalScrollIndicator={false}
			/>
			)}
		</Screen>
	);
}

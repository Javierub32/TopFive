import { View, Text, FlatList, RefreshControl, Touchable, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';;
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SearchBar } from '@/Add/components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddIcon, SocialBubblesIcon } from 'components/Icons';
import { AntDesign, EvilIcons, FontAwesome5 } from '@expo/vector-icons';



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

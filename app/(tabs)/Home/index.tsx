import { View, Text, FlatList, RefreshControl, TouchableOpacity, BackHandler} from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { Screen } from 'components/Screen';
import { useTheme } from 'context/ThemeContext';;
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SearchIcon2, SocialBubblesIcon } from 'components/Icons';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { NativeAdCard } from 'components/NativeAdCard';
import { useCallback, useRef } from "react";
import { useNotification } from "context/NotificationContext";



export default function HomeScreen() {
	const { colors } = useTheme();
	const { activities, loading, refreshing, fetchActivities, refreshActivities } = useActivity();
	const navigation  = useNavigation();
	const lastBackPress = useRef(0);
	const { showNotification } = useNotification();

	useFocusEffect(
		useCallback(() => {
			const action = BackHandler.addEventListener('hardwareBackPress', () => {
				if(Date.now() - lastBackPress.current <= 2000) {
					BackHandler.exitApp()
				} else {
					lastBackPress.current = Date.now();
					showNotification({
						title: 'Atención',
						description: 'Vuelve a tocar para salir.',
						isChoice: false,
						delete: false,
						success: false,
					})
				}
				return true
			});
			const unsuscribe = navigation.addListener('beforeRemove', (e) => {
				if(e.data.action.type === 'GO_BACK') {
					e.preventDefault();
				}
			})

			return () => {
			action.remove();
			unsuscribe()
			} 
		}, [navigation, showNotification])
	);

	return (
		<Screen>
			<View className="px-4 pt-6">
				<View className="mb-4 flex-row items-center justify-between">
					<Text className="text-3xl font-bold" style={{ color: colors.primaryText }}>
						Inicio
					</Text>
					
					<View className="flex-row gap-x-2">
						<NotificationButton from="Home" />
						<TouchableOpacity
							onPress={() => router.push('/search')}
							className="rounded-full p-3"
						>
							<SearchIcon2 size={24} color={colors.primaryText} />
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{loading && activities.length === 0 ? (
				<LoadingIndicator />
			) : (
			<FlatList
				data={activities}
				keyExtractor={(item, index) => `${item.recurso_id}-${index}`}
				renderItem={({ item, index }) => (
					<>
						<ActivityItem item={item} />
						{(index + 1 ) % 4 === 0 && <NativeAdCard />}
					</>

				)}
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
							onPress={() => router.push('/search')}
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

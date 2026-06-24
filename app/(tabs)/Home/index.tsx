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
import { useCallback, useRef, useState } from "react";
import { useNotification } from "context/NotificationContext";
import {AppText} from 'components/AppText';
import Animated from 'react-native-reanimated';
import { useCollapsibleHeader } from 'hooks/useCollapsibleHeader';	

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
	const { colors } = useTheme();
	const { activities, loading, refreshing, fetchActivities, refreshActivities } = useActivity();
	const navigation  = useNavigation();
	const lastBackPress = useRef(0);
	const { showNotification } = useNotification();

	const [headerHeight, setHeaderHeight] = useState(80);
	const { scrollHandler, headerStyle, headerOpacityStyle } = useCollapsibleHeader(headerHeight);


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
			<Animated.View 
                //  onLayout PARA CAPTURAR LA ALTURA EXACTA sin hacerlo a mano
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    // solo actualizamos si la diferencia es notable con la por defecto
                    if (Math.abs(headerHeight - height) > 1) {
                        setHeaderHeight(height);
                    }
                }}
                style={[
                    headerStyle, 
                    { 
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, 
                        height: headerHeight, 
                        zIndex: 10,
                        backgroundColor: colors.background
                    }
                ]}
            >
				<Animated.View style={headerOpacityStyle} className="px-4 pt-6">
					<View className="mb-4 flex-row items-center justify-between">
						<AppText className="text-3xl font-bold" style={{ color: colors.primaryText }}>
							Inicio
						</AppText>
						
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
				</Animated.View>
			</Animated.View>
			<View className="px-4 pt-6">
				<View className="mb-4 flex-row items-center justify-between">
					<AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
						Inicio
					</AppText>
					
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
			<AnimatedFlatList
				data={activities}
				onScroll={scrollHandler}
                scrollEventThrottle={16}
				keyExtractor={(item: any, index: number) => `${item.recurso_id}-${index}`} //hay que tiparlos explicitamente por el ANIMATED
				renderItem={({ item, index }: {item: any, index: number}) => (
					<>
						<ActivityItem item={item}/>
						{(index + 1 ) % 4 === 0 && <NativeAdCard />}
					</>

				)}
				contentContainerStyle={activities.length === 0 ? 
					{ flex: 1, paddingHorizontal: 16, paddingVertical: 150, paddingTop: headerHeight + 20 } : 
					{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: headerHeight + 10 }}
				onEndReached={fetchActivities}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refreshActivities} tintColor={colors.primaryText} progressViewOffset={headerHeight} />	
				}
				ListEmptyComponent={() => (
					<View className="flex-1 items-center px-4 ">
						<SocialBubblesIcon className="mb-4" size={100} color={colors.primaryText} />
						<AppText className="text-2xl text-center mb-4 font-bold" style={{color: colors.primaryText}}>
							No tienes ningún amigo con reseñas acabadas.
						</AppText>
						<AppText className="text-md text-center mb-6" style={{color: colors.primaryText}}>
							Agrega amigos para poder ver sus reseñas.
						</AppText>
						<TouchableOpacity
							onPress={() => router.push('/search')}
							className="px-6 py-3 rounded-3xl"
							style={{backgroundColor: colors.primary}}
						>
							<AppText className="text-white text-base font-bold">Buscar amigos </AppText>
							
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
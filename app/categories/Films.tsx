import { View, Text } from 'react-native';

export default function Films() {
	return (
		<View>
			<View className="bg-surfaceButton rounded-xl p-5 mx-4 my-2 border-2 border-primary/30">
				<Text className="text-primary text-xl font-bold mb-3">Top 5 Películas</Text>
				<Text className="text-primaryText text-base">Aquí podrás ver y gestionar tus películas favoritas</Text>
			</View>
			
			<View className="bg-surfaceButton rounded-xl p-4 mx-4 my-2 border-2 border-primary/30">
				<Text className="text-primaryText">1. Película #1</Text>
			</View>
			
			<View className="bg-surfaceButton rounded-xl p-4 mx-4 my-2 border-2 border-primary/30">
				<Text className="text-primaryText">2. Película #2</Text>
			</View>
			
			<View className="bg-surfaceButton rounded-xl p-4 mx-4 my-2 border-2 border-primary/30">
				<Text className="text-primaryText">3. Película #3</Text>
			</View>
		</View>
	);
}

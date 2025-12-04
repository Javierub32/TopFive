import { View, Text } from 'react-native';

export default function Films() {
	return (
		<View>
			<View className="bg-gray-800 rounded-xl p-5 mx-4 my-2 border-2 border-purple-500/30">
				<Text className="text-purple-400 text-xl font-bold mb-3">Top 5 Películas</Text>
				<Text className="text-white text-base">Aquí podrás ver y gestionar tus películas favoritas</Text>
			</View>
			
			<View className="bg-gray-800 rounded-xl p-4 mx-4 my-2 border-2 border-purple-500/30">
				<Text className="text-white">1. Película #1</Text>
			</View>
			
			<View className="bg-gray-800 rounded-xl p-4 mx-4 my-2 border-2 border-purple-500/30">
				<Text className="text-white">2. Película #2</Text>
			</View>
			
			<View className="bg-gray-800 rounded-xl p-4 mx-4 my-2 border-2 border-purple-500/30">
				<Text className="text-white">3. Película #3</Text>
			</View>
		</View>
	);
}

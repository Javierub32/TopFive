import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import data from './data/content.json'

import FeaturedList from './components/featuredList';
import FeaturedBooks from './components/featuredBooks';
import FeaturedFilms from './components/featuredFilms';
import FeaturedGames from './components/featuredGames';
import FeaturedSeries from './components/featuredSeries';
import FeaturedSongs from './components/featuredSongs';

export default function HomeScreen() {
	return (
		<Screen>
			<StatusBar style="light" />
			<View className="px-4 pt-6">
				<Text className="mb-4 text-3xl font-bold text-white">Inicio</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={true} className="flex-1 mb-4">
				<FeaturedList featured={data.featuredItems} />
				<FeaturedBooks featured={data.popularBooks} />
				<FeaturedFilms featured={data.popularMovies} />
				<FeaturedSeries featured={data.popularSeries} />
				<FeaturedGames featured={data.popularGames} />
				<FeaturedSongs featured={data.popularSongs} />
			</ScrollView>
		</Screen>
	);
}

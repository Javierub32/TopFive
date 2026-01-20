import { View, Text, ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import data from 'src/Home/data/content.json'

import FeaturedList from 'src/Home/components/featured-contents/FeaturedList';
import FeaturedBooks from 'src/Home/components/featured-contents/FeaturedBooks';
import FeaturedFilms from 'src/Home/components/featured-contents/FeaturedFilms';
import FeaturedGames from 'src/Home/components/featured-contents/FeaturedGames';
import FeaturedSeries from 'src/Home/components/featured-contents/FeaturedSeries';
import FeaturedSongs from 'src/Home/components/featured-contents/FeaturedSongs';


export default function HomeScreen() {
	return (
		<Screen>
			<StatusBar style="light" />
			<View className="px-4 pt-6">
				<Text className="mb-4 text-3xl font-bold text-primaryText">Inicio</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-4">
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

import { View, Text, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { BarChart } from 'react-native-chart-kit';
import { useState } from 'react';

{/*Const that we use to make the example */}
const categoryData = {
  libros: {
    title: 'Total Libros Leídos',
    total: 128,
    average: 10.7,
    chartData: [9, 5, 13, 14, 16, 12, 8, 11, 14, 13, 10, 15]
  },
  películas: {
    title: 'Total Películas Vistas',
    total: 96,
    average: 8.0,
    chartData: [7, 4, 10, 11, 13, 9, 6, 8, 11, 10, 7, 12]
  },
  series: {
    title: 'Total Series Vistas',
    total: 72,
    average: 6.0,
    chartData: [5, 3, 8, 9, 10, 7, 4, 6, 9, 8, 5, 10]
  },
  canciones: {
    title: 'Total Canciones Escuchadas',
    total: 450,
    average: 37.5,
    chartData: [30, 25, 40, 42, 48, 38, 28, 35, 42, 40, 32, 45]
  },
  videojuegos: {
    title: 'Total Videojuegos Jugados',
    total: 48,
    average: 4.0,
    chartData: [3, 2, 5, 6, 7, 4, 2, 3, 6, 5, 3, 7]
  }
};

type CategoryKey = 'libros' | 'películas' | 'series' | 'canciones' | 'videojuegos';
{/*The section that displays the user's profile and statistics */}
export default function HomeScreen() {
  const { signOut } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('libros');

  return (
    <Screen>
      <StatusBar style="light" />
      <Text className="mb-3 p-7 text-center text-2xl font-bold text-white">
        Perfil de Usuario
      </Text>
      
      <Pressable className="absolute top-5 right-4 z-10 rounded-full bg-white/10 p-3">
        <Ionicons name="settings-sharp" size={24} color="#fff" />
      </Pressable>
			{/*Profile Info Section*/}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center p-2">
          <View className="items-center mb-2">
            <View style={{ position: 'relative', paddingTop: 20, paddingRight: 20 }}>
              <Image
                source={require('../../assets/profile-photo.jpeg')}
                className="h-20 w-20 rounded-full"
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
              <Image
                source={require('../../assets/gorro-navideño.png')}
                style={{ 
                  position: 'absolute', 
                  top: 5, 
                  right: 15, 
                  width: 50, 
                  height: 60, 
                  transform: [{ rotate: '20deg' }]
                }}
                resizeMode="contain"
              />
            </View>

            <Text className="mb-3 text-center text-2xl font-bold text-white">
              Rafaela Benitez
            </Text>
          </View>
        </View>
        
        {/*Category Selection ScrollView*/}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          className="border-b border-gray-700 mb-4"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Pressable onPress={() => setSelectedCategory('libros')}>
            <View className={`py-3 px-3 ${selectedCategory === 'libros' ? 'border-b-4 border-purple-500' : ''}`}>
              <Text className={`text-center ${selectedCategory === 'libros' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
                Libros
              </Text>
            </View>
          </Pressable>
          
          <Pressable onPress={() => setSelectedCategory('películas')}>
            <View className={`py-3 px-4 ${selectedCategory === 'películas' ? 'border-b-4 border-purple-500' : ''}`}>
              <Text className={`text-center ${selectedCategory === 'películas' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
                Películas
              </Text>
            </View>
          </Pressable>
          
          <Pressable onPress={() => setSelectedCategory('series')}>
            <View className={`py-3 px-4 ${selectedCategory === 'series' ? 'border-b-4 border-purple-500' : ''}`}>
              <Text className={`text-center ${selectedCategory === 'series' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
                Series
              </Text>
            </View>
          </Pressable>
          
          <Pressable onPress={() => setSelectedCategory('canciones')}>
            <View className={`py-3 px-4 ${selectedCategory === 'canciones' ? 'border-b-4 border-purple-500' : ''}`}>
              <Text className={`text-center ${selectedCategory === 'canciones' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
                Canciones
              </Text>
            </View>
          </Pressable>
          
          <Pressable onPress={() => setSelectedCategory('videojuegos')}>
            <View className={`py-3 px-4 ${selectedCategory === 'videojuegos' ? 'border-b-4 border-purple-500' : ''}`}>
              <Text className={`text-center ${selectedCategory === 'videojuegos' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
                Videojuegos
              </Text>
            </View>
          </Pressable>
        </ScrollView>

        <View className="flex-row px-1 mb-2">
          <View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
            <Text className="text-purple-400 text-xl font-bold mb-3">{categoryData[selectedCategory].title}</Text>
            <View className="flex-1 justify-end">
              <Text className="text-white text-2xl text-right">{categoryData[selectedCategory].total}</Text>
            </View>
          </View>
          <View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
            <Text className="text-purple-400 text-xl font-bold mb-3">Promedio/Mes</Text>
            <View className="flex-1 justify-end">
              <Text className="text-white text-2xl text-right">{categoryData[selectedCategory].average}</Text>
            </View>
          </View>
        </View>
				{/*Graph Section*/}
        <View className="px-3 pb-10">
          <View className="bg-gray-800 rounded-xl py-5 my-2 border-2 border-purple-500/30" style={{ overflow: 'hidden' }}>
            <Text className="text-purple-400 text-xl font-bold mb-3 px-5">Actividad Anual</Text>
            <View style={{ alignItems: 'center' }}>
              <BarChart
                data={{
                  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                  datasets: [{
                    data: categoryData[selectedCategory].chartData
                  }]
                }}
                width={screenWidth - 56}
                height={160}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: '#1f2937',
                  backgroundGradientTo: '#1f2937',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                  style: { borderRadius: 16 },
                  barPercentage: 0.5,
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#374151',
                    strokeWidth: 0
                  },
                  propsForLabels: {
                    fontSize: 10
                  }
                }}
                style={{
                  borderRadius: 16,
                  marginLeft: -15,
                  marginTop: 10,
									marginRight: 50
                }}
                withInnerLines={false}
                fromZero={true}
                withHorizontalLabels={false}
                showValuesOnTopOfBars={true}
              />
            </View>
          </View>
        </View>
        
      </ScrollView>
    </Screen>
  );
}
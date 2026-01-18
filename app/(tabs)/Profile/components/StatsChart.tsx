import { View, Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { DateSelector } from './DateSelector';

export const StatsChart = ({ data, selectedYear, setSelectedYear }: { data: number[], selectedYear: number, setSelectedYear: (year: number) => void }) => (
  <View className="px-3 pb-10">
    <View className="my-2 rounded-xl border-2 border-borderButton bg-surfaceButton py-5" style={{ overflow: 'hidden' }}>
	  <View className= "flex flex-row justify-between px-5 mb-3">
		<Text className="mb-3  text-xl text-title">Actividad Anual</Text>
		<DateSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
	  </View>
      
      <View style={{ alignItems: 'center' }}>
        <BarChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{ data }]
          }}
          width={useWindowDimensions().width - 56}
          height={160}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#1f2937',
            backgroundGradientTo: '#1f2937',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
            barPercentage: 0.5,
            propsForBackgroundLines: { strokeWidth: 0 },
            propsForLabels: { fontSize: 10 },
          }}
          style={{ borderRadius: 16, marginLeft: -15, marginTop: 10, marginRight: 50 }}
          withInnerLines={false}
          fromZero={true}
          withHorizontalLabels={false}
          showValuesOnTopOfBars={true}
        />
      </View>
    </View>
  </View>
);
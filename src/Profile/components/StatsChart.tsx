import { View, Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { DateSelector } from './DateSelector';
import { useTheme } from 'context/ThemeContext';

export const StatsChart = ({
  data,
  selectedYear,
  setSelectedYear,
}: {
  data: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}) => {  
  const { width } = useWindowDimensions(); // BIEN: Hook al inicio
  const {colors} = useTheme();
  const chartWidth = width - 56;
  return (
    <View className="px-3 pb-10">
      <View
        className="my-2 rounded-xl border-2 py-5"
        style={{ borderColor: colors.borderButton, backgroundColor: colors.surfaceButton, overflow: 'hidden' }}>
        <View className="mb-3 flex flex-row justify-between px-5">
          <Text className="mb-3 text-xl" style={{ color: colors.title }}>Actividad Anual</Text>
          <DateSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </View>

        <View style={{ alignItems: 'center' }}>
          <BarChart
            data={{
              labels: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
              ],
              datasets: [{ data }],
            }}
            width={chartWidth}
            height={170}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: colors.surfaceButton,
              backgroundGradientTo: colors.surfaceButton,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${colors.statsColor}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${colors.statsLabelColor}, ${opacity})`,
              barPercentage: 0.5,
              propsForBackgroundLines: { strokeWidth: 0 },
              propsForLabels: { fontSize: 12 },
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
};

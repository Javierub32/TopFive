import { View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { DateSelector } from './DateSelector';
import { useTheme } from 'context/ThemeContext';
import { useState, useEffect } from 'react';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
export const StatsChart = ({
  data,
  selectedYear,
  setSelectedYear,
}: {
  data: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [barData, setBarData] = useState<any[]>([]);

  // 1. CÁLCULO DE DIMENSIONES CON LÍMITE (MAX-WIDTH)
  const MAX_CHART_WIDTH = 700; // Tope máximo para PC
  const screenAvailable = width - 80; // Tu margen original para móviles

  // Si la pantalla es gigante, usamos 800px. Si es móvil, usamos el ancho de pantalla.
  const chartWidth = Math.min(screenAvailable, MAX_CHART_WIDTH);

  const segmentWidth = chartWidth / 12;
  const barWidth = segmentWidth * 0.65;
  const spacing = segmentWidth * 0.35;

  // Ajuste de fuentes: Grande solo si es tablet/PC, pero sin pasarse
  const isLargeDevice = width > 400;
  const fontSizeLabel = isLargeDevice ? 11 : 9;
  const fontSizeValue = isLargeDevice ? 12 : 10;

  useEffect(() => {
    const months = [
      t('profile.monthsAbbreviation.january'),
      t('profile.monthsAbbreviation.february'),
      t('profile.monthsAbbreviation.march'),
      t('profile.monthsAbbreviation.april'),
      t('profile.monthsAbbreviation.may'),
      t('profile.monthsAbbreviation.june'),
      t('profile.monthsAbbreviation.july'),
      t('profile.monthsAbbreviation.august'),
      t('profile.monthsAbbreviation.september'),
      t('profile.monthsAbbreviation.october'),
      t('profile.monthsAbbreviation.november'),
      t('profile.monthsAbbreviation.december'),
    ];

    const formattedData = data.map((value, index) => ({
      value: value,
      label: months[index],
      frontColor: value > 0 ? colors.primary : colors.borderButton,
      topLabelComponent: () =>
        value > 0 ? (
          <AppText
            style={{
              color: colors.primaryText,
              fontSize: fontSizeValue,
              marginBottom: 1,
              fontWeight: 'bold',
              width: segmentWidth,
              textAlign: 'center',
            }}>
            {value}
          </AppText>
        ) : null,
      barBorderTopLeftRadius: 4,
      barBorderTopRightRadius: 4,
      spacing: spacing,
      labelTextStyle: {
        color: colors.secondaryText,
        fontSize: fontSizeLabel,
        textAlign: 'center',
        width: segmentWidth,
      },
    }));

    setBarData(formattedData);
  }, [data, colors, segmentWidth, spacing, fontSizeLabel, fontSizeValue, t]);

  return (
    <View className="mb-10 px-1">
      <View
        className="flex-col rounded-2xl p-4 pl-2 shadow-sm"
        style={{
          backgroundColor: colors.surfaceButton,
          borderColor: colors.borderButton,
        }}>
        <View className="mb-6 flex-row items-center justify-between px-2">
          <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('profile.activity')}
          </AppText>
          <DateSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </View>

        {/* 
           CONTENEDOR CENTRADO
           width: '100%' asegura que el contenedor ocupe la tarjeta.
           items-center: Centra la gráfica si esta es más pequeña que la pantalla (PC).
        */}
        <View className="w-full items-center justify-center overflow-hidden">
          <BarChart
            data={barData}
            width={chartWidth} // Usamos el ancho con tope
            height={200}
            barWidth={barWidth}
            initialSpacing={spacing / 2}
            noOfSections={4}
            // Estilos
            rulesColor={colors.borderButton}
            rulesType="dashed"
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={colors.borderButton}
            hideYAxisText={true}
            // Animación
            isAnimated={false}
            animationDuration={400}
            // Configuración
            showYAxisIndices={false}
            hideRules={false}
            scrollAnimation={false}
          />
        </View>
      </View>
    </View>
  );
};

declare module 'react-native-chart-kit' {
  import { ReactNode } from 'react';
  import { ViewStyle } from 'react-native';

  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    backgroundGradientFromOpacity?: number;
    backgroundGradientToOpacity?: number;
    decimalPlaces?: number;
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    style?: ViewStyle;
    propsForBackgroundLines?: object;
    propsForLabels?: object;
    strokeWidth?: number;
    useShadowColorFromDataset?: boolean;
    barPercentage?: number;
  }

  export interface Dataset {
    data: number[];
    color?: (opacity: number) => string;
    colors?: Array<(opacity: number) => string>;
    strokeWidth?: number;
    withDots?: boolean;
  }

  export interface ChartData {
    labels?: string[];
    datasets: Dataset[];
    legend?: string[];
  }

  export interface AbstractChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig?: ChartConfig;
    style?: ViewStyle;
    withHorizontalLabels?: boolean;
    withVerticalLabels?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withDots?: boolean;
    withShadow?: boolean;
    withScrollableDot?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
    xAxisLabel?: string;
    segments?: number;
    transparent?: boolean;
    verticalLabelRotation?: number;
    horizontalLabelRotation?: number;
    showValuesOnTopOfBars?: boolean;
  }

  export class BarChart extends React.Component<AbstractChartProps> {}
  export class LineChart extends React.Component<AbstractChartProps> {}
  export class PieChart extends React.Component<AbstractChartProps> {}
  export class ProgressChart extends React.Component<AbstractChartProps> {}
  export class ContributionGraph extends React.Component<AbstractChartProps> {}
  export class StackedBarChart extends React.Component<AbstractChartProps> {}
}

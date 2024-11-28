import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import theme from "theme";

import { MONTH_NAMES } from "modules/app/constants";
import { Habit } from "modules/habits/types";
import { calculateAverageAmountsPerMonth } from "modules/habits/utils/calculateAverageAmountsPerMonth";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import styled from "styled-components/native";
import { hexToRGB } from "utils/hexToRGB";

const { width: screenWidth } = Dimensions.get("window");

const chartConfig: AbstractChartConfig = {
  backgroundGradientFrom: theme.colors.cyan500,
  backgroundGradientFromOpacity: 0.2,
  backgroundGradientTo: theme.colors.cyan500,
  backgroundGradientToOpacity: 0.4,
  color: (opacity = 1) => hexToRGB(theme.colors.darkBlueText, opacity),
  useShadowColorFromDataset: true, // optional,
  horizontalOffset: 200,
  decimalPlaces: 1,
};

type Props = {
  habit: Habit;
};

const HabitLineChart = ({ habit }: Props): JSX.Element => {
  const { t } = useTranslation();

  const data: LineChartData = useMemo(() => {
    return {
      labels: MONTH_NAMES,
      datasets: [
        {
          data: calculateAverageAmountsPerMonth(habit.logs),
          color: (opacity = 1) => hexToRGB(theme.colors.cyan700, opacity),
          strokeWidth: 2, // optional
        },
      ],
      legend: ["Progress"],
    };
  }, [habit.logs]);

  return (
    <Container
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
    >
      <LineChart
        data={data}
        width={screenWidth * 2}
        height={256}
        chartConfig={chartConfig}
        style={{ borderRadius: 8 }}
        bezier
      />
    </Container>
  );
};

const Container = styled.ScrollView`
  width: 100%;
  border-radius: 8px;
  margin-top: 40px;
  border-radius: 10px;
`;

export default React.memo(HabitLineChart);

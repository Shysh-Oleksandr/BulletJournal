import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { useHabitsSelectedYear } from "modules/habits/hooks/useHabitsSelectedYear";
import { HabitLog } from "modules/habits/types";
import { calculateHabitAverageAmounts } from "modules/habits/utils/calculateHabitAverageAmounts";
import { generateWeekLabels } from "modules/habits/utils/generateWeekLabels";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import styled from "styled-components/native";
import { hexToRGB } from "utils/hexToRGB";

const { width: screenWidth } = Dimensions.get("window");

const CHART_HEIGHT = 230;

const chartConfig: AbstractChartConfig = {
  backgroundGradientFrom: theme.colors.cyan500,
  backgroundGradientFromOpacity: 0.2,
  backgroundGradientTo: theme.colors.cyan500,
  backgroundGradientToOpacity: 0.4,
  color: (opacity = 1) => hexToRGB(theme.colors.darkBlueText, opacity),
  decimalPlaces: 1,
  fillShadowGradient: theme.colors.cyan500,
  fillShadowGradientOpacity: 0.8,
};

type Props = {
  habitLogs: HabitLog[];
};

const HabitMonthlyLineChart = ({ habitLogs }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    selectedYear,
    isPrevYearDisabled,
    isNextYearDisabled,
    onPrevArrowPress,
    onNextArrowPress,
  } = useHabitsSelectedYear(habitLogs);

  const data: LineChartData = useMemo(() => {
    return {
      labels: generateWeekLabels(selectedYear),
      datasets: [
        {
          data: calculateHabitAverageAmounts(habitLogs, selectedYear),
          color: (opacity = 1) => hexToRGB(theme.colors.cyan700, opacity),
        },
      ],
    };
  }, [habitLogs, selectedYear]);

  const renderDotContent = useCallback(
    ({
      x,
      y,
      index,
      indexData,
    }: {
      x: number;
      y: number;
      index: number;
      indexData: number;
    }) => {
      if (indexData === 0) {
        return null;
      }

      return (
        <View
          key={index}
          style={{
            position: "absolute",
            top: y - 20,
            left: x - 10,
          }}
        >
          <Typography fontSize="xs" color={theme.colors.darkBlueText}>
            {indexData.toFixed(1)}
          </Typography>
        </View>
      );
    },
    [],
  );

  return (
    <Container>
      <HeaderContainer>
        <Typography
          fontWeight="bold"
          color={theme.colors.darkBlueText}
          fontSize="xl"
        >
          {t("habits.weeklyProgress")}
        </Typography>
        <ArrowsContainer>
          <ArrowContainer
            onPress={onPrevArrowPress}
            hitSlop={BUTTON_HIT_SLOP}
            disabled={isPrevYearDisabled}
          >
            <FontAwesome5
              name="chevron-left"
              color={
                isPrevYearDisabled ? theme.colors.gray : theme.colors.cyan500
              }
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
          <Typography
            fontWeight="semibold"
            color={theme.colors.darkBlueText}
            fontSize="lg"
          >
            {selectedYear}
          </Typography>
          <ArrowContainer
            onPress={onNextArrowPress}
            hitSlop={BUTTON_HIT_SLOP}
            disabled={isNextYearDisabled}
          >
            <FontAwesome5
              name="chevron-right"
              color={
                isNextYearDisabled ? theme.colors.gray : theme.colors.cyan500
              }
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
        </ArrowsContainer>
      </HeaderContainer>
      <ChartContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      >
        <LineChart
          data={data}
          width={screenWidth * 3.4}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          style={{
            borderRadius: 8,
          }}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          bezier
          renderDotContent={renderDotContent}
        />
      </ChartContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-top: 30px;
`;

const ChartContainer = styled.ScrollView`
  width: 100%;
  margin-top: 10px;
`;

const HeaderContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ArrowsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const ArrowContainer = styled.TouchableOpacity``;

export default React.memo(HabitMonthlyLineChart);

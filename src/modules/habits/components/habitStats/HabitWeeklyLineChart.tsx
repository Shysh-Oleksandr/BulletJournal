import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { useHabitChartConfig } from "modules/habits/hooks/useHabitChartConfig";
import { useHabitsSelectedYear } from "modules/habits/hooks/useHabitsSelectedYear";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { HabitLog } from "modules/habits/types";
import { calculateHabitAverageAmounts } from "modules/habits/utils/calculateHabitAverageAmounts";
import { generateWeekLabels } from "modules/habits/utils/generateWeekLabels";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import styled from "styled-components/native";
import { hexToRGB } from "utils/hexToRGB";

const { width: screenWidth } = Dimensions.get("window");

const CHART_HEIGHT = 230;

type Props = {
  habitLogs: HabitLog[];
  color?: string;
};

const HabitMonthlyLineChart = ({
  habitLogs,
  color = theme.colors.cyan500,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { textColor } = useHabitStatColors(color);

  const {
    selectedYear,
    isPrevYearDisabled,
    isNextYearDisabled,
    onPrevArrowPress,
    onNextArrowPress,
  } = useHabitsSelectedYear(habitLogs);

  const chartConfig = useHabitChartConfig(color);

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
        <Typography fontWeight="bold" color={textColor} fontSize="xl">
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
              color={isPrevYearDisabled ? theme.colors.gray : textColor}
              size={theme.fontSizes.xxl}
            />
          </ArrowContainer>
          <Typography fontWeight="semibold" color={textColor} fontSize="lg">
            {selectedYear}
          </Typography>
          <ArrowContainer
            onPress={onNextArrowPress}
            hitSlop={BUTTON_HIT_SLOP}
            disabled={isNextYearDisabled}
          >
            <FontAwesome5
              name="chevron-right"
              color={isNextYearDisabled ? theme.colors.gray : textColor}
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
          getDotColor={() => color}
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

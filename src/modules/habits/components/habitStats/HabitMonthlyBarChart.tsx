import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { MONTH_NAMES } from "modules/app/constants";
import { useHabitsSelectedYear } from "modules/habits/hooks/useHabitsSelectedYear";
import { HabitLog } from "modules/habits/types";
import { calculateHabitMonthlyAmountsPerYear } from "modules/habits/utils/calculateHabitMonthlyAmountsPerYear";
import {
  ChartConfig,
  ChartData,
} from "react-native-chart-kit/dist/HelperTypes";
import styled from "styled-components/native";
import { hexToRGB } from "utils/hexToRGB";

const { width: screenWidth } = Dimensions.get("window");

const CHART_HEIGHT = 230;

const chartConfig: ChartConfig = {
  backgroundGradientFrom: theme.colors.cyan500,
  backgroundGradientFromOpacity: 0.2,
  backgroundGradientTo: theme.colors.cyan500,
  backgroundGradientToOpacity: 0.4,
  color: (opacity = 1) => hexToRGB(theme.colors.darkBlueText, opacity),
  decimalPlaces: 0,
  fillShadowGradient: theme.colors.cyan500,
  fillShadowGradientOpacity: 0.8,
};

type Props = {
  habitLogs: HabitLog[];
};

const HabitMonthlyBarChart = ({ habitLogs }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    selectedYear,
    isPrevYearDisabled,
    isNextYearDisabled,
    onPrevArrowPress,
    onNextArrowPress,
  } = useHabitsSelectedYear(habitLogs);

  const data: ChartData = useMemo(() => {
    return {
      labels: MONTH_NAMES,
      datasets: [
        {
          data: calculateHabitMonthlyAmountsPerYear(habitLogs, selectedYear),
          color: (opacity = 1) => hexToRGB(theme.colors.cyan700, opacity),
        },
      ],
    };
  }, [habitLogs, selectedYear]);

  return (
    <Container>
      <HeaderContainer>
        <Typography
          fontWeight="bold"
          color={theme.colors.darkBlueText}
          fontSize="xl"
        >
          {t("habits.monthlyProgress")}
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
        <BarChart
          data={data}
          width={screenWidth * 1.9}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          style={{
            borderRadius: 8,
            paddingRight: 0,
          }}
          withHorizontalLabels={false}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
        />
      </ChartContainer>
    </Container>
  );
};

const Container = styled.View``;

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

export default React.memo(HabitMonthlyBarChart);

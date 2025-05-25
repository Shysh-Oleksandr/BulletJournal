import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { useCalculateHabitAverageByPeriod } from "modules/habits/hooks/useCalculateHabitAverageByPeriod";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { Habit, HabitPeriods } from "modules/habits/types";
import styled from "styled-components/native";

import HabitStatItem from "./HabitStatItem";

type Props = {
  habit: Habit;
};

const HabitInfoCard = ({ habit }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { textColor, bgColor, secondaryTextColor } = useHabitStatColors(
    habit.color,
  );

  const { currentStreak, longestStreak, overallCompletions, oldestLogDate } =
    habit.cachedMetrics;

  const weeklyAverage = useCalculateHabitAverageByPeriod(
    oldestLogDate,
    overallCompletions,
    habit.frequency.period,
  );

  const habitStatItems = useMemo(
    () => [
      {
        amount: `${overallCompletions}/${habit.overallTarget}`,
        label: t("habits.completedStat"),
      },
      {
        amount: `${weeklyAverage}/${habit.frequency.days}`,
        label: t(
          habit.frequency.period === HabitPeriods.WEEK
            ? "habits.weeklyAvg"
            : "habits.monthlyAvg",
        ),
      },
      {
        amount: `${currentStreak}/${habit.streakTarget}`,
        label: t("habits.currentStreakStat"),
      },
      {
        amount: longestStreak,
        label: t("habits.longestStreakStat"),
      },
    ],
    [
      overallCompletions,
      currentStreak,
      habit.frequency.days,
      habit.frequency.period,
      habit.overallTarget,
      habit.streakTarget,
      longestStreak,
      t,
      weeklyAverage,
    ],
  );

  return (
    <Container colors={[theme.colors.cyan300, bgColor]}>
      {habitStatItems.map((item, index) => (
        <HabitStatItem
          key={index}
          amount={item.amount}
          label={item.label}
          textColor={textColor}
          secondaryTextColor={secondaryTextColor}
        />
      ))}
    </Container>
  );
};

const Container = styled(LinearGradient)`
  width: 100%;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 30px;
  elevation: 6;
  border-radius: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export default React.memo(HabitInfoCard);

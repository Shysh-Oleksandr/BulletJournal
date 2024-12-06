import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { useCalculateHabitWeeklyAverage } from "modules/habits/hooks/useCalculateHabitWeeklyAverage";
import { useHabitStatColors } from "modules/habits/hooks/useHabitStatColors";
import { useHabitStreakData } from "modules/habits/hooks/useHabitStreakData";
import { Habit } from "modules/habits/types";
import styled from "styled-components/native";

import HabitStatItem from "./HabitStatItem";

type Props = {
  habit: Habit;
};

const HabitStreakCard = ({ habit }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { completedLogs, currentStreak, longestStreak } =
    useHabitStreakData(habit);

  const { textColor, bgColor, secondaryTextColor } = useHabitStatColors(
    habit.color,
  );

  const weeklyAverage = useCalculateHabitWeeklyAverage(
    habit.logs,
    completedLogs.length,
  );

  const habitStatItems = useMemo(
    () => [
      {
        amount: `${completedLogs.length}/${habit.overallTarget}`,
        label: t("habits.completedStat"),
      },
      {
        amount: weeklyAverage,
        label: t("habits.weeklyAvg"),
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
      completedLogs.length,
      currentStreak,
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

export default React.memo(HabitStreakCard);

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { useCalculateHabitWeeklyAverage } from "modules/habits/hooks/useCalculateHabitWeeklyAverage";
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

  const weeklyAverage = useCalculateHabitWeeklyAverage(
    habit.logs,
    completedLogs.length,
  );

  return (
    <Container colors={[theme.colors.cyan300, theme.colors.cyan400]}>
      <HabitStatItem
        amount={`${completedLogs.length}/${habit.overallTarget}`}
        label={t("habits.completedStat")}
      />
      <HabitStatItem amount={weeklyAverage} label={t("habits.weeklyAvg")} />
      <HabitStatItem
        amount={`${currentStreak}/${habit.streakTarget}`}
        label={t("habits.currentStreakStat")}
      />
      <HabitStatItem
        amount={longestStreak}
        label={t("habits.longestStreakStat")}
      />
    </Container>
  );
};

const Container = styled(LinearGradient)`
  width: 100%;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 30px;
  elevation: 10;
  border-radius: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export default React.memo(HabitStreakCard);

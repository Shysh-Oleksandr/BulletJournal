import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

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

  return (
    <Container colors={[theme.colors.white, theme.colors.cyan400]}>
      <HabitStatItem
        amount={completedLogs.length}
        label={t("habits.completedStat")}
      />
      {/* TODO: count it: */}
      {/* <HabitStatItem amount={32} label="Weekly avg." /> */}
      <HabitStatItem
        amount={currentStreak}
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
  margin-bottom: 116px;
  elevation: 10;
  border-radius: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export default React.memo(HabitStreakCard);

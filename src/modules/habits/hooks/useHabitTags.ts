import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Habit, HabitTypes } from "../types";

import { useHabitStreakData } from "./useHabitStreakData";

type Props = {
  habit: Habit;
  amountTarget?: number;
};

export const useHabitTags = ({ habit, amountTarget }: Props) => {
  const { t } = useTranslation();

  const { completedLogs, currentStreak, longestStreak } =
    useHabitStreakData(habit);

  const tags = useMemo(() => {
    const tags: string[] = [];

    if (habit.habitType !== HabitTypes.CHECK) {
      tags.push(
        `${t("habits.targetAmount")} ${amountTarget ?? habit.amountTarget} ${
          habit.units
        }`,
      );
    }

    tags.push(
      t("habits.streakDays", {
        count: currentStreak,
        target: habit.streakTarget,
      }),
    );
    tags.push(
      t("habits.longestStreak", {
        count: longestStreak,
      }),
    );
    tags.push(
      t("habits.overallDays", {
        count: habit.overallTarget,
        value: completedLogs.length,
      }),
    );

    return tags;
  }, [
    habit,
    t,
    currentStreak,
    longestStreak,
    completedLogs.length,
    amountTarget,
  ]);

  return tags;
};

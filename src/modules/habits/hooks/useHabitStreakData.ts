import { useMemo } from "react";

import { Habit } from "../types";
import { calculateHabitStreak } from "../utils/calculateHabitStreak";

export const useHabitStreakData = (habit: Habit) =>
  useMemo(() => {
    const completedLogs = habit.logs.filter(
      (log) => log.percentageCompleted >= 100,
    );

    return { completedLogs, ...calculateHabitStreak(completedLogs) };
  }, [habit]);

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Habit, HabitTypes } from "../types";
import {
  calculateHabitBestStreaks,
  getHabitStreakInfo,
} from "../utils/calculateHabitBestStreaks";

import { useHabitFrequencyLabel } from "./useHabitFrequencyLabel";

export const useHabitTags = (habit: Habit, amountTarget?: number) => {
  const { t } = useTranslation();

  const { currentStreak, longestStreak, overallCompleted } = useMemo(
    () => getHabitStreakInfo(habit.logs, calculateHabitBestStreaks(habit.logs)),
    [habit.logs],
  );

  const frequencyLabel = useHabitFrequencyLabel(habit.frequency);

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
      `${t("habits.streak")}: ${currentStreak}/${habit.streakTarget} ${t(
        "habits.times",
      )}`,
    );
    tags.push(
      `${t("habits.longestStreak")}: ${longestStreak}/${habit.streakTarget} ${t(
        "habits.times",
      )}`,
    );
    tags.push(
      `${t("habits.overall")}: ${overallCompleted}/${habit.overallTarget} ${t(
        "habits.times",
      )}`,
    );

    tags.push(`${t("habits.frequency")}: ${frequencyLabel}`);

    return tags;
  }, [
    habit,
    t,
    currentStreak,
    longestStreak,
    overallCompleted,
    frequencyLabel,
    amountTarget,
  ]);

  return tags;
};

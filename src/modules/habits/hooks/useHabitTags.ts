import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Habit, HabitTypes } from "../types";

import { useHabitFrequencyLabel } from "./useHabitFrequencyLabel";

export const useHabitTags = (habit: Habit, amountTarget?: number) => {
  const { t } = useTranslation();

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
      `${t("habits.streak")}: ${habit.cachedMetrics.currentStreak}/${habit.streakTarget} ${t(
        "habits.times",
      )}`,
    );
    tags.push(
      `${t("habits.longestStreak")}: ${habit.cachedMetrics.longestStreak} ${t("habits.times")}`,
    );
    tags.push(
      `${t("habits.overall")}: ${habit.cachedMetrics.overallCompletions}/${habit.overallTarget} ${t(
        "habits.times",
      )}`,
    );

    tags.push(`${t("habits.frequency")}: ${frequencyLabel}`);

    return tags;
  }, [habit, t, frequencyLabel, amountTarget]);

  return tags;
};

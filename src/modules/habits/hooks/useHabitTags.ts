import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Habit, HabitTypes } from "../types";
import {
  calculateHabitBestStreaks,
  getHabitStreakInfo,
} from "../utils/calculateHabitBestStreaks";
import { getDaysByHabitPeriod } from "../utils/getDaysByHabitPeriod";

export const useHabitTags = (habit: Habit, amountTarget?: number) => {
  const { t } = useTranslation();

  const { currentStreak, longestStreak, overallCompleted } = useMemo(
    () => getHabitStreakInfo(habit.logs, calculateHabitBestStreaks(habit.logs)),
    [habit.logs],
  );

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

    const isDaily =
      habit.frequency.days === getDaysByHabitPeriod(habit.frequency.period);

    tags.push(
      `${t("habits.frequency")}: ${isDaily ? t("habits.daily") : `${habit.frequency.days} ${t("habits.times")}/${t(`habits.${habit.frequency.period}`).toLowerCase()}`}`,
    );

    return tags;
  }, [habit, t, currentStreak, longestStreak, overallCompleted, amountTarget]);

  return tags;
};

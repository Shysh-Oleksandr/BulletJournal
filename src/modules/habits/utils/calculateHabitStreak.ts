import { differenceInDays, isSameDay, subDays } from "date-fns";

import { HabitLog } from "../types";

export const calculateHabitStreak = (completedLogs: HabitLog[]) => {
  if (completedLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const today = new Date();
  const isTodayCompleted = completedLogs.some((log) =>
    isSameDay(log.date, today),
  );

  const isYesterdayCompleted = completedLogs.some((log) =>
    isSameDay(log.date, subDays(today, 1)),
  );

  const todayStreakValue = isTodayCompleted ? 1 : 0;

  if (completedLogs.length === 1 && isTodayCompleted)
    return { currentStreak: 1, longestStreak: 1 };

  const sortedLogs = completedLogs.slice().sort((a, b) => a.date - b.date);

  const { currentStreak, longestStreak } = sortedLogs.reduce(
    (acc, log, index) => {
      if (index === 0) {
        return { currentStreak: 1, longestStreak: 1 };
      }

      const currentDate = new Date(log.date);
      const prevDate = new Date(sortedLogs[index - 1].date);

      const diffDays = differenceInDays(currentDate, prevDate);

      if (diffDays === 1) {
        // If consecutive dates, increment current streak
        acc.currentStreak++;
      } else {
        // If broken streak, update longest streak if necessary and reset current streak
        acc.longestStreak = Math.max(acc.longestStreak, acc.currentStreak);
        acc.currentStreak = 1;
      }

      // Update longest streak if the current streak is longer
      acc.longestStreak = Math.max(acc.longestStreak, acc.currentStreak);

      return acc;
    },
    { currentStreak: 1, longestStreak: 1 },
  );

  return {
    currentStreak: isYesterdayCompleted ? currentStreak : todayStreakValue,
    longestStreak,
  };
};

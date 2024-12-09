import {
  addDays,
  differenceInDays,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";

import { HabitLog, HabitStreak } from "../types";

const YESTERDAY = addDays(startOfDay(new Date()), -1);

export function getHabitStreakInfo(
  habitLogs: HabitLog[],
  bestStreaksData: HabitStreak[],
) {
  if (bestStreaksData.length === 0)
    return { currentStreak: 0, longestStreak: 0, overallCompleted: 0 };

  const isTodayCompleted = habitLogs.some(
    (log) => isToday(log.date) && log.percentageCompleted >= 100,
  );
  const currentStreak =
    bestStreaksData.find((streak) =>
      isWithinInterval(YESTERDAY, {
        start: streak.startDate,
        end: streak.lastOptionalLogDate,
      }),
    )?.numberOfDays ?? (isTodayCompleted ? 1 : 0);

  const longestStreak = Math.max(
    ...bestStreaksData.map((streak) => streak.numberOfDays),
  );

  const overallCompleted = habitLogs.filter(
    (log) => log.percentageCompleted >= 100,
  ).length;

  return { currentStreak, longestStreak, overallCompleted };
}

export function getTopStreaks(
  allStreaks: HabitStreak[],
  limit = 6,
): HabitStreak[] {
  return allStreaks
    .slice()
    .sort((a, b) => b.numberOfDays - a.numberOfDays)
    .slice(0, limit);
}

export const calculateHabitBestStreaks = (
  habitLogs: HabitLog[],
): HabitStreak[] => {
  const sortedHabitLogs = [...habitLogs].sort((a, b) => a.date - b.date);

  const streaks: HabitStreak[] = [];
  let currentStreak: HabitStreak | null = null;

  for (let i = 0; i < sortedHabitLogs.length; i++) {
    const log = sortedHabitLogs[i];
    const prevLog = sortedHabitLogs[i - 1];
    const currentDate = startOfDay(log.date);

    const isCompleted = log.percentageCompleted >= 100;

    // Check if the current log is completed or optional
    if (isCompleted || (log.isOptional && currentStreak)) {
      if (
        currentStreak &&
        prevLog &&
        differenceInDays(currentDate, startOfDay(prevLog.date)) <= 1
      ) {
        currentStreak.lastOptionalLogDate = currentDate;
        // Continue the streak
        if (isCompleted) {
          currentStreak.numberOfDays++; // Only count completed days
          currentStreak.endDate = currentDate;
        }
      } else {
        // Start a new streak
        currentStreak = {
          startDate: currentDate,
          endDate: currentDate,
          lastOptionalLogDate: currentDate,
          numberOfDays: isCompleted ? 1 : 0,
        };
      }
    } else if (currentStreak) {
      // End the streak if the current log is not completed or optional
      streaks.push(currentStreak);
      currentStreak = null;
    }
  }

  // Add the last streak if any
  if (currentStreak) {
    streaks.push(currentStreak);
  }

  return streaks;
};

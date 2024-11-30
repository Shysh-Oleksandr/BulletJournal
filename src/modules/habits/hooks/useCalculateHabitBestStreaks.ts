import { differenceInDays } from "date-fns";
import { useMemo } from "react";

import { HabitLog, HabitStreak } from "../types";

function getTopStreaks(allStreaks: HabitStreak[], limit = 6): HabitStreak[] {
  allStreaks.sort((a, b) => b.numberOfDays - a.numberOfDays);

  return allStreaks.slice(0, limit);
}

export const useCalculateHabitBestStreaks = (
  habitLogs: HabitLog[],
  limit = 6,
): HabitStreak[] =>
  useMemo(() => {
    const sortedHabitLogs = [...habitLogs].sort((a, b) => a.date - b.date);

    const streaks: HabitStreak[] = [];
    let currentStreak: {
      startDate: Date;
      endDate: Date;
      count: number;
    } | null = null;

    for (let i = 0; i < sortedHabitLogs.length; i++) {
      const log = sortedHabitLogs[i];
      const prevLog = sortedHabitLogs[i - 1];

      // Check if the current habit is completed
      if (log.percentageCompleted >= 100) {
        const currentDate = new Date(log.date);

        if (
          currentStreak &&
          prevLog &&
          differenceInDays(currentDate, prevLog.date) <= 1
        ) {
          // Continue the current streak
          currentStreak.endDate = currentDate;
          currentStreak.count++;
        } else {
          // Start a new streak
          if (currentStreak) {
            streaks.push({
              startDate: currentStreak.startDate,
              endDate: currentStreak.endDate,
              numberOfDays: currentStreak.count,
            });
          }
          currentStreak = {
            startDate: currentDate,
            endDate: currentDate,
            count: 1,
          };
        }
      } else if (currentStreak) {
        // End the current streak if the current habit is not completed
        streaks.push({
          startDate: currentStreak.startDate,
          endDate: currentStreak.endDate,
          numberOfDays: currentStreak.count,
        });
        currentStreak = null;
      }
    }

    // Add the last streak if any
    if (currentStreak) {
      streaks.push({
        startDate: currentStreak.startDate,
        endDate: currentStreak.endDate,
        numberOfDays: currentStreak.count,
      });
    }

    return getTopStreaks(streaks, limit);
  }, [habitLogs, limit]);

import { differenceInDays } from "date-fns";
import { useMemo } from "react";

import { HabitLog } from "../types";

export const useCalculateHabitWeeklyAverage = (
  habitLogs: HabitLog[],
  completedDays: number,
) =>
  useMemo(() => {
    const logs = habitLogs.filter((log) => log.amount && log.amount > 0);

    if (logs.length === 0) return 0;

    const oldestHabitLog = logs.reduce((prev, next) => {
      if (prev.date < next.date) return prev;

      return next;
    }).date;

    const habitLifeTimeInDays =
      differenceInDays(new Date(), oldestHabitLog) || 1;

    const weeklyAverage = Math.round((completedDays / habitLifeTimeInDays) * 7);

    return weeklyAverage;
  }, [completedDays, habitLogs]);

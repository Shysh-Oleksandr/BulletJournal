import { differenceInDays, startOfDay, startOfToday } from "date-fns";
import { useMemo } from "react";

import { HabitLog, HabitPeriods } from "../types";
import { getDaysByHabitPeriod } from "../utils/getDaysByHabitPeriod";

export const useCalculateHabitAverageByPeriod = (
  habitLogs: HabitLog[],
  completedDays: number,
  habitPeriod: HabitPeriods,
) =>
  useMemo(() => {
    const logs = habitLogs.filter(
      (log) => log.amount && log.amount > 0 && !log.isArtificial,
    );

    if (logs.length === 0) return 0;

    const oldestHabitLog = logs.reduce((prev, next) => {
      if (prev.date < next.date) return prev;

      return next;
    }).date;

    const habitLifeTimeInDays =
      (differenceInDays(startOfToday(), startOfDay(oldestHabitLog)) || 0) + 1;

    const periodDays = getDaysByHabitPeriod(habitPeriod);

    const averageByPeriod = Math.round(
      (completedDays / habitLifeTimeInDays) * periodDays,
    );

    return Math.min(averageByPeriod, periodDays);
  }, [completedDays, habitLogs, habitPeriod]);

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  getDay,
  getMonth,
  getWeek,
  getYear,
  isSameDay,
} from "date-fns";

import { Habit, HabitLog, HabitPeriods } from "../types";

import { getDaysByHabitPeriod } from "./getDaysByHabitPeriod";

export const calculateHabitLogsStatus = (habit: Habit): HabitLog[] => {
  const { logs: habitLogs, frequency } = habit;
  const { days, period } = frequency;

  const filteredHabitLogs = habitLogs.filter(
    (log) => log.amount && log.amount > 0,
  );

  if (!filteredHabitLogs.length) return [];

  const periodLength = getDaysByHabitPeriod(period);

  const today = new Date().setHours(0, 0, 0, 0);

  // Fill missing days
  const habitLogsDates = filteredHabitLogs.map((log) => log.date);
  const startDate = habitLogsDates ? Math.min(...habitLogsDates) : today;
  const endDate = today;

  const logs = fillMissingDays(filteredHabitLogs, startDate, endDate);

  if (days === periodLength) {
    return logs;
  }

  // Group logs by the desired period (week or month)
  const periodLogs = groupLogsByPeriod(logs, period);

  const processedLogs: HabitLog[] = [];

  Object.values(periodLogs).forEach((logsInPeriod) => {
    const isCurrentPeriod =
      logsInPeriod[logsInPeriod.length - 1].date === today;

    const relevantLogsInPeriod = isCurrentPeriod
      ? fillMissingDays(
          logsInPeriod,
          logsInPeriod[0].date,
          period === HabitPeriods.MONTH
            ? endOfMonth(logsInPeriod[0].date).getTime()
            : endOfWeek(logsInPeriod[0].date, { weekStartsOn: 1 }).getTime(),
        )
      : logsInPeriod;

    // Calculate the number of times the habit has been logged for this period
    const completedCount = relevantLogsInPeriod.filter(
      (l) => l.percentageCompleted >= 100,
    ).length;

    if (completedCount === 0) {
      processedLogs.push(...relevantLogsInPeriod);

      return;
    }

    const shouldAdjustDays = relevantLogsInPeriod[0].date === startDate;
    const adjustedDays = shouldAdjustDays
      ? getAdjustedDays(relevantLogsInPeriod[0].date, days, period)
      : days;

    const periodLength = relevantLogsInPeriod.length;
    const spacing = Math.round(periodLength / adjustedDays);

    if (completedCount >= adjustedDays) {
      processedLogs.push(
        ...relevantLogsInPeriod.map((l) => ({
          ...l,
          isOptional: l.percentageCompleted < 100,
        })),
      );

      return;
    }

    let remainingLogs = adjustedDays - completedCount;
    let lastCompletedLogIndex = 0;

    relevantLogsInPeriod.forEach((log, index) => {
      if (log.percentageCompleted >= 100) {
        lastCompletedLogIndex = index;
        processedLogs.push(log); // Completed logs are always necessary

        return;
      }

      // Determine if the current day is necessary based on spacing
      const isNecessaryDay =
        remainingLogs > 0 &&
        (index + 1) %
          Math.min(lastCompletedLogIndex + spacing + 1, periodLength - 1) ===
          0;

      if (isNecessaryDay) {
        lastCompletedLogIndex = index;
        remainingLogs--;
      }

      processedLogs.push({ ...log, isOptional: !isNecessaryDay });
    });
  });

  return processedLogs;
};

// Helper to get the key for grouping by period (week or month)
const getPeriodKeyByDate = (date: number, period: HabitPeriods) => {
  if (period === HabitPeriods.WEEK) {
    const week = getWeek(date, { weekStartsOn: 1 });

    return `${getYear(date)}-W${week}`;
  }

  return `${getYear(date)}-${getMonth(date) + 1}`;
};

// Helper to group logs by week or month
function groupLogsByPeriod(
  logs: HabitLog[],
  period: HabitPeriods,
): Record<string, HabitLog[]> {
  const groupedLogs: Record<string, HabitLog[]> = {};

  logs.forEach((log) => {
    const key = getPeriodKeyByDate(log.date, period);

    groupedLogs[key] = groupedLogs[key] || [];
    groupedLogs[key].push(log);
  });

  return groupedLogs;
}

// Helper to fill in missing days between the start and end dates
function fillMissingDays(
  habitLogs: HabitLog[],
  startDate: number,
  endDate: number,
): HabitLog[] {
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  return days.map((day) => {
    const log = habitLogs.find((l) => isSameDay(l.date, day));

    return (
      log || {
        date: day.getTime(),
        percentageCompleted: 0,
        amount: 0,
        isArtificial: true,
      }
    );
  });
}

// Helper the target days for first habit period(e.g. if a habit starts in the middle of a period)
function getAdjustedDays(
  periodStartDate: number,
  days: number,
  period: HabitPeriods,
) {
  const periodLength = getDaysByHabitPeriod(period);
  const remainingPeriodDays =
    periodLength -
    (period === HabitPeriods.WEEK
      ? getDay(periodStartDate)
      : getDate(periodStartDate));

  return Math.ceil((days * remainingPeriodDays) / periodLength); // Scale frequency proportionally
}

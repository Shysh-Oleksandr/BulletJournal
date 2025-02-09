import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { useAppSelector } from "store/helpers/storeHooks";

import { getActiveHabits } from "../HabitsSelectors";
import { Habit } from "../types";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

export const useHabitsWeekDates = (selectedDate: number) => {
  const activeHabits = useAppSelector(getActiveHabits);

  return useMemo(() => {
    const weekDates = getWeekDatesByDate(selectedDate);

    return getWeeklyCompletionRates(activeHabits, weekDates);
  }, [activeHabits, selectedDate]);
};

const getWeeklyCompletionRates = (
  activeHabits: Habit[],
  weekDates: number[],
): { date: number; percentageCompleted: number }[] => {
  if (activeHabits.length === 0)
    return weekDates.map((date) => ({ date, percentageCompleted: 0 }));

  const habitsByStartDate: Record<string, number> = {};
  const completionRates: { date: number; percentageCompleted: number }[] = [];

  // Calculate the start date for each habit
  activeHabits.forEach((habit) => {
    const habitStartDate = habit.logs.reduce(
      (earliestDate, log) =>
        earliestDate ? Math.min(earliestDate, log.date) : log.date,
      null as number | null,
    );

    if (habitStartDate) {
      habitsByStartDate[habit._id] = habitStartDate;
    }
  });

  // Calculate completion rates for each date in the week
  weekDates.forEach((date) => {
    let completedLogs = 0;
    let mandatoryHabitsCount = 0;

    activeHabits.forEach((habit) => {
      const habitStartDate = habitsByStartDate[habit._id];

      // Skip habits that haven't started yet
      if (habitStartDate && date < habitStartDate) return;

      const log = habit.logs.find((log) => isSameDay(log.date, date));

      if (log) {
        // Count mandatory habits and completed logs
        if (!log.isOptional) {
          mandatoryHabitsCount++;
        }

        if (log.percentageCompleted >= 100) {
          completedLogs++;
        }
      }
    });

    const percentageCompleted = mandatoryHabitsCount
      ? Math.round((completedLogs / mandatoryHabitsCount) * 100)
      : 0;

    completionRates.push({ date, percentageCompleted });
  });

  return completionRates;
};

import { addDays, isAfter, isSameDay, startOfToday } from "date-fns";
import { useMemo } from "react";

import { Habit } from "../types";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

const today = startOfToday();

export const useHabitsWeekDates = (selectedDate: Date, habits: Habit[]) => {
  const { weekDates, ...arrowsData } = useMemo(() => {
    const weekDates = getWeekDatesByDate(selectedDate);

    const nextWeekFirstDay = addDays(weekDates[weekDates.length - 1], 1);
    const prevWeekLastDay = addDays(weekDates[0], -1);

    const isNextWeekDisabled = isAfter(nextWeekFirstDay, today);

    return {
      weekDates,
      nextWeekFirstDay,
      prevWeekLastDay,
      isNextWeekDisabled,
    };
  }, [selectedDate]);

  const mappedWeekDates = useMemo(
    () =>
      weekDates.map((date) => {
        const completedHabitsCount = habits.filter((habit) =>
          habit.logs.some((log) => log.completed && isSameDay(log.date, date)),
        ).length;

        return {
          date,
          progress: Math.round((completedHabitsCount / habits.length) * 100),
        };
      }),
    [habits, weekDates],
  );

  return { ...arrowsData, mappedWeekDates };
};

import {
  format,
  getDay,
  isFirstDayOfMonth,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";

import { SIMPLE_DATE_FORMAT } from "modules/calendar/data";

import { Habit, HabitStreak } from "../types";

export const getMarkedHabitLogsDates = (
  habit: Habit,
  bestStreaksData: HabitStreak[],
) => {
  const streakIntervals = bestStreaksData
    .filter((streak) => streak.numberOfDays > 1)
    .map((streak) => ({
      startDate: startOfDay(streak.startDate),
      endDate: startOfDay(streak.endDate),
    }));

  return habit.logs.reduce(
    (acc, item) => {
      const formattedDate = format(item.date, SIMPLE_DATE_FORMAT);

      const date = startOfDay(item.date);

      let isWithinStreak = false;
      let startingDay = false;
      let endingDay = false;

      for (const { startDate, endDate } of streakIntervals) {
        if (isSameDay(date, startDate)) startingDay = true;
        if (isSameDay(date, endDate)) endingDay = true;
        if (
          !isWithinStreak &&
          isWithinInterval(date, { start: startDate, end: endDate })
        ) {
          isWithinStreak = true;
        }
        if (startingDay && endingDay && isWithinStreak) break;
      }

      const isFirstCalendarDay = getDay(date) === 1 || isFirstDayOfMonth(date);

      acc[formattedDate] = {
        marked: true,
        streakState: {
          displayRightLine: startingDay || (isWithinStreak && !endingDay),
          displayLeftLine: isFirstCalendarDay && isWithinStreak && !startingDay,
        },
      };

      return acc;
    },
    {} as {
      [key: string]: {
        marked: boolean;
        streakState?: {
          displayRightLine: boolean;
          displayLeftLine: boolean;
        };
      };
    },
  );
};

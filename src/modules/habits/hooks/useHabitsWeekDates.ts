import { addDays, isAfter, isSameDay, startOfToday } from "date-fns";
import { useMemo } from "react";

import { useAppSelector } from "store/helpers/storeHooks";

import { getHabits } from "../HabitsSlice";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

const today = startOfToday();

export const useHabitsWeekDates = (selectedDate: number) => {
  const habits = useAppSelector(getHabits);

  const { weekDates, ...arrowsData } = useMemo(() => {
    const weekDates = getWeekDatesByDate(selectedDate);

    const nextWeekFirstDay = addDays(
      weekDates[weekDates.length - 1],
      1,
    ).getTime();
    const prevWeekLastDay = addDays(weekDates[0], -1).getTime();

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
        const mandatoryHabits = habits.filter((habit) =>
          habit.frequency.weekdays.some(
            (weekday) => new Date(weekday).getDay() === new Date(date).getDay(),
          ),
        );

        const completedHabitsCount = mandatoryHabits.filter((habit) => {
          const isMandatoryForSelectedDate = habit.frequency.weekdays.some(
            (weekday) => new Date(weekday).getDay() === new Date(date).getDay(),
          );

          const isCompleted = habit.logs.some(
            (log) =>
              log.percentageCompleted >= 100 && isSameDay(log.date, date),
          );

          return isMandatoryForSelectedDate && isCompleted;
        }).length;

        return {
          date,
          progress: Math.round(
            (completedHabitsCount / mandatoryHabits.length) * 100,
          ),
        };
      }),
    [habits, weekDates],
  );

  return { ...arrowsData, mappedWeekDates };
};

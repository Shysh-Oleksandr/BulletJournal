import { isSameDay } from "date-fns";

import { Habit } from "../types";

import { getIsActiveOnSelectedDate } from "./getIsActiveOnSelectedDate";

export function calculateMandatoryHabitsByDate(habits: Habit[], date: number) {
  const mandatoryHabits: Habit[] = [];
  const optionalHabits: Habit[] = [];

  habits.forEach((habit) => {
    const selectedDateLog = habit.logs.find((log) => isSameDay(log.date, date));
    const isActiveOnSelectedDate = getIsActiveOnSelectedDate(
      date,
      habit.oldestLogDate,
    );

    selectedDateLog?.isOptional || !isActiveOnSelectedDate
      ? optionalHabits.push(habit)
      : mandatoryHabits.push(habit);
  });

  return {
    mandatoryHabits,
    optionalHabits,
  };
}

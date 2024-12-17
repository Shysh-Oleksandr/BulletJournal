import { isBefore, isSameDay } from "date-fns";

import { Habit } from "../types";

export function calculateMandatoryHabitsByDate(habits: Habit[], date: number) {
  const mandatoryHabits: Habit[] = [];
  const optionalHabits: Habit[] = [];

  habits.forEach((habit) => {
    const selectedDateLog = habit.logs.find((log) => isSameDay(log.date, date));
    const isActiveOnSelectedDate = Boolean(
      habit.oldestLogDate && !isBefore(date, habit.oldestLogDate),
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

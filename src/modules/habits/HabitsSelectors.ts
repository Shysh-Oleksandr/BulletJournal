import createCachedSelector from "re-reselect";

import { RootState } from "../../store/store";

import { habitsApi } from "./HabitsApi";
import { Habit } from "./types";

export const getHabits = createCachedSelector(
  (state: RootState) => state.auth.user?._id,
  (state: RootState) => state,
  (userId, state) => {
    if (!userId) return [];

    const selectHabits = habitsApi.endpoints.fetchHabits.select(userId);
    const result = selectHabits(state);

    return result?.data?.habits ?? [];
  },
)(
  // Cache key resolver
  (state: RootState) => state.auth.user?._id ?? "no_user",
);

export const getHabitById = createCachedSelector(
  getHabits,
  (_: RootState, habitId: string) => habitId,
  (habits, habitId) => habits.find((habit) => habit._id === habitId) as Habit,
)((_: RootState, habitId: string) => habitId);

export const getHabitsBySelectedDate = createCachedSelector(
  getHabits,
  (_: RootState, selectedDate: number) => selectedDate,
  (habits, selectedDate) => {
    const selectedWeekday = new Date(selectedDate).getDay();

    const mandatoryHabits: Habit[] = [];
    const optionalHabits: Habit[] = [];

    habits.forEach((habit) => {
      const isMandatoryForSelectedDate = habit.frequency.weekdays.some(
        (weekday) => new Date(weekday).getDay() === selectedWeekday,
      );

      isMandatoryForSelectedDate
        ? mandatoryHabits.push(habit)
        : optionalHabits.push(habit);
    });

    return {
      mandatoryHabits,
      optionalHabits,
    };
  },
)((_: RootState, selectedDate: number) => selectedDate);

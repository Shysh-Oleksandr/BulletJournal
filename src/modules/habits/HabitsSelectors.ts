import createCachedSelector from "re-reselect";

import { RootState } from "../../store/store";

import { habitsApi } from "./HabitsApi";
import { Habit } from "./types";
import { calculateHabitLogsStatus } from "./utils/calculateHabitLogsStatus";
import { calculateMandatoryHabitsByDate } from "./utils/calculateMandatoryHabitsByDate";

export const getHabits = createCachedSelector(
  (state: RootState) => state.auth.user?._id,
  (state: RootState) => state,
  (userId, state) => {
    if (!userId) return [];

    const selectHabits = habitsApi.endpoints.fetchHabits.select(userId);
    const result = selectHabits(state);

    const habits = result?.data?.habits ?? [];

    return habits.map((habit) => ({
      ...habit,
      logs: calculateHabitLogsStatus(habit),
    }));
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
  (habits, selectedDate) =>
    calculateMandatoryHabitsByDate(habits, selectedDate),
)((_: RootState, selectedDate: number) => selectedDate);

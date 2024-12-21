import createCachedSelector from "re-reselect";

import { RootState } from "../../store/store";

import { habitsApi } from "./HabitsApi";
import { calculateMandatoryHabitsByDate } from "./utils/calculateMandatoryHabitsByDate";

export const getAllHabits = createCachedSelector(
  (state: RootState) =>
    habitsApi.endpoints.fetchHabits.select(state.auth.user!._id)(state),
  (result) => {
    if (!result?.data) return [];

    const { allIds, byId } = result.data;

    return allIds.map((id) => byId[id]);
  },
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getActiveHabits = createCachedSelector(getAllHabits, (habits) =>
  habits.filter((habit) => !habit.isArchived),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getArchivedHabits = createCachedSelector(getAllHabits, (habits) =>
  habits.filter((habit) => habit.isArchived),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getHabitById = createCachedSelector(
  (state: RootState) => {
    if (!state.auth.user) return { data: null };

    return habitsApi.endpoints.fetchHabits.select(state.auth.user._id)(state);
  },
  (_: RootState, habitId: string) => habitId,
  (result, habitId) => {
    return result.data!.byId[habitId];
  },
)((_: RootState, habitId: string) => habitId);

export const getHabitsBySelectedDate = createCachedSelector(
  getActiveHabits,
  (_: RootState, selectedDate: number) => selectedDate,
  (habits, selectedDate) =>
    calculateMandatoryHabitsByDate(habits, selectedDate),
)((_: RootState, selectedDate: number) => selectedDate);

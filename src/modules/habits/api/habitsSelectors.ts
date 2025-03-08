import { useAuth } from "modules/auth/AuthContext";

import { calculateMandatoryHabitsByDate } from "../utils/calculateMandatoryHabitsByDate";

import { useGetHabitsQuery } from "./habitsApi";

export const useAllHabits = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useGetHabitsQuery(userId);

  const allHabits = data?.allIds.map((id) => data.byId[id]) || [];

  return { allHabits, isLoading, isError };
};

export const useActiveHabits = () => {
  const { allHabits, isLoading, isError } = useAllHabits();

  const activeHabits = allHabits.filter((habit) => !habit.isArchived);

  return { activeHabits, isLoading, isError };
};

export const useArchivedHabits = () => {
  const { allHabits, isLoading, isError } = useAllHabits();

  const archivedHabits = allHabits.filter((habit) => habit.isArchived);

  return { archivedHabits, isLoading, isError };
};

export const useHabitById = (habitId: string) => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useGetHabitsQuery(userId);

  return {
    habit: data!.byId[habitId],
    isLoading,
    isError,
  };
};

export const useHabitsBySelectedDate = (selectedDate: number) => {
  const { activeHabits, isLoading, isError } = useActiveHabits();

  return {
    habits: calculateMandatoryHabitsByDate(activeHabits, selectedDate),
    isLoading,
    isError,
  };
};

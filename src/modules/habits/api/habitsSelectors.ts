import { useMemo } from "react";

import { calculateMandatoryHabitsByDate } from "../utils/calculateMandatoryHabitsByDate";

import { useGetHabitsQuery } from "./habitsApi";

// Create a single source of truth hook that other hooks will use
export const useHabitsData = () => {
  return useGetHabitsQuery();
};

export const useAllHabits = () => {
  const { data, isLoading, isError } = useHabitsData();

  const allHabits = useMemo(
    () => data?.allIds.map((id) => data.byId[id]) || [],
    [data],
  );

  return useMemo(
    () => ({ allHabits, isLoading, isError }),
    [allHabits, isLoading, isError],
  );
};

export const useActiveHabits = () => {
  const { allHabits, isLoading, isError } = useAllHabits();

  const activeHabits = useMemo(
    () => allHabits.filter((habit) => !habit.isArchived),
    [allHabits],
  );

  return useMemo(
    () => ({ activeHabits, isLoading, isError }),
    [activeHabits, isLoading, isError],
  );
};

export const useArchivedHabits = () => {
  const { allHabits, isLoading, isError } = useAllHabits();

  const archivedHabits = useMemo(
    () => allHabits.filter((habit) => habit.isArchived),
    [allHabits],
  );

  return { archivedHabits, isLoading, isError };
};

export const useHabitById = (habitId: string) => {
  const { data, isLoading, isError } = useHabitsData();

  return useMemo(
    () => ({
      habit: data?.byId[habitId],
      isLoading,
      isError,
    }),
    [data, habitId, isLoading, isError],
  );
};

export const useHabitsBySelectedDate = (selectedDate: number) => {
  const { activeHabits, isLoading, isError } = useActiveHabits();

  const habits = useMemo(
    () => calculateMandatoryHabitsByDate(activeHabits, selectedDate),
    [activeHabits, selectedDate],
  );

  return {
    habits,
    isLoading,
    isError,
  };
};

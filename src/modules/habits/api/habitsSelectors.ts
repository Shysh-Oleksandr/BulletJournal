import { useMemo } from "react";

import { useAuth } from "modules/auth/AuthContext";

import { calculateMandatoryHabitsByDate } from "../utils/calculateMandatoryHabitsByDate";

import { useGetHabitsQuery } from "./habitsApi";

export const useAllHabits = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useGetHabitsQuery(userId);

  const allHabits = useMemo(
    () => data?.allIds.map((id) => data.byId[id]) || [],
    [data],
  );

  return { allHabits, isLoading, isError };
};

export const useActiveHabits = () => {
  const { allHabits, isLoading, isError } = useAllHabits();

  const activeHabits = useMemo(
    () => allHabits.filter((habit) => !habit.isArchived),
    [allHabits],
  );

  return { activeHabits, isLoading, isError };
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

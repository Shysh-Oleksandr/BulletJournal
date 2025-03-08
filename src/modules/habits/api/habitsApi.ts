import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "store/api/client";

import {
  CreateHabitRequest,
  CreateHabitResponse,
  DeleteHabitRequest,
  FetchHabitsResponse,
  Habit,
  HabitsState,
  ReorderHabitsRequest,
  UpdateHabitRequest,
} from "../types";
import { calculateHabitLogsStatus } from "../utils/calculateHabitLogsStatus";

export const getHabitsQueryKey = (userId?: string) => ["habits", userId];

export const useGetHabitsQuery = (userId: string) => {
  return useQuery<HabitsState>({
    queryKey: getHabitsQueryKey(userId),
    queryFn: async () => {
      const { data } = await client.get<FetchHabitsResponse>(
        `/habits/${userId}`,
      );

      const byId: Record<string, Habit> = {};
      const allIds: string[] = [];

      data.habits.forEach((habit) => {
        const { processedLogs, oldestLogDate } =
          calculateHabitLogsStatus(habit);

        byId[habit._id] = { ...habit, logs: processedLogs, oldestLogDate };
        allIds.push(habit._id);
      });

      return { byId, allIds };
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...payload }: UpdateHabitRequest) =>
      client.patch(`/habits/update/${_id}`, payload),

    onMutate: async (updatedHabit) => {
      await queryClient.cancelQueries({
        queryKey: getHabitsQueryKey(updatedHabit.author),
      });

      const previousHabits = queryClient.getQueryData<HabitsState>(
        getHabitsQueryKey(updatedHabit.author),
      );

      queryClient.setQueryData(
        getHabitsQueryKey(updatedHabit.author),
        (oldData: HabitsState | undefined) => {
          if (!oldData) return oldData;

          const newHabits = updatedHabit.withDeepClone
            ? JSON.parse(JSON.stringify(oldData))
            : oldData;
          const habit = newHabits.byId[updatedHabit._id];

          if (habit) {
            Object.assign(habit, updatedHabit);

            const { processedLogs, oldestLogDate } =
              calculateHabitLogsStatus(habit);

            habit.logs = processedLogs;
            habit.oldestLogDate = oldestLogDate;
          }

          return newHabits;
        },
      );

      return { previousHabits };
    },

    onError: (_err, updatedHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(
          getHabitsQueryKey(updatedHabit.author),
          context.previousHabits,
        );
      }
    },

    onSettled: (_, __, updatedHabit) => {
      // TODO: check if this is needed
      queryClient.invalidateQueries({
        queryKey: getHabitsQueryKey(updatedHabit.author),
      });
    },
  });
};

export const useCreateHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHabitRequest) =>
      client.post<CreateHabitResponse>("/habits/create", payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getHabitsQueryKey(variables.author),
      });
    },
  });
};

export const useReorderHabitsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitIds }: ReorderHabitsRequest) =>
      client.put("/habits/reorder", habitIds),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getHabitsQueryKey(variables.userId),
      });
    },
  });
};

export const useDeleteHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteHabitRequest) =>
      client.delete(`/habits/${_id}`),

    onSuccess: (_, { _id, userId }) => {
      queryClient.setQueryData(
        getHabitsQueryKey(userId),
        (oldData: HabitsState | undefined) => {
          if (!oldData) return oldData;

          const newHabits = {
            ...oldData,
            byId: { ...oldData.byId },
            allIds: oldData.allIds.filter((id) => id !== _id),
          };

          delete newHabits.byId[_id];

          return newHabits;
        },
      );

      queryClient.invalidateQueries({
        queryKey: getHabitsQueryKey(userId),
      });
    },
  });
};

export const habitsApi = {
  useGetHabitsQuery,
  useUpdateHabitMutation,
  useCreateHabitMutation,
  useReorderHabitsMutation,
  useDeleteHabitMutation,
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "store/api/client";

import {
  CreateHabitLogRequest,
  CreateHabitRequest,
  CreateHabitResponse,
  DeleteHabitRequest,
  Habit,
  HabitsState,
  ReorderHabitsRequest,
  UpdateHabitLogRequest,
  UpdateHabitRequest,
} from "../types";
import { calculateHabitLogsStatus } from "../utils/calculateHabitLogsStatus";

export const habitsQueryKey = ["habits"];

export const useGetHabitsQuery = () => {
  return useQuery<HabitsState>({
    queryKey: habitsQueryKey,
    queryFn: async () => {
      const { data } = await client.get<Habit[]>(`/habits`);

      const byId: Record<string, Habit> = {};
      const allIds: string[] = [];

      data.forEach((habit) => {
        const { processedLogs, oldestLogDate } =
          calculateHabitLogsStatus(habit);

        byId[habit._id] = { ...habit, logs: processedLogs, oldestLogDate };
        allIds.push(habit._id);
      });

      return { byId, allIds };
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetHabitQuery = (habitId: string) => {
  return useQuery<Habit>({
    queryKey: [...habitsQueryKey, habitId],
    queryFn: async () => {
      const { data } = await client.get<Habit>(`/habits/${habitId}`);

      const { processedLogs, oldestLogDate } = calculateHabitLogsStatus(data);

      return { ...data, logs: processedLogs, oldestLogDate };
    },
  });
};

export const useUpdateHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...payload }: UpdateHabitRequest) =>
      client.put(`/habits/${_id}`, payload),

    onMutate: async (updatedHabit) => {
      await queryClient.cancelQueries({
        queryKey: habitsQueryKey,
      });

      const previousHabits =
        queryClient.getQueryData<HabitsState>(habitsQueryKey);

      queryClient.setQueryData(
        habitsQueryKey,
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

    onError: (_err, _, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(habitsQueryKey, context.previousHabits);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const useCreateHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHabitRequest) =>
      client.post<CreateHabitResponse>("/habits", payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const useReorderHabitsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderHabitsRequest) =>
      client.post("/habits/reorder", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const useDeleteHabitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteHabitRequest) =>
      client.delete(`/habits/${_id}`),

    onSuccess: (_, { _id }) => {
      queryClient.setQueryData(
        habitsQueryKey,
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
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const useUpdateHabitLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...payload }: UpdateHabitLogRequest) =>
      client.put(`/habit-logs/${_id}`, payload),

    onMutate: async (updatedLog) => {
      await queryClient.cancelQueries({
        queryKey: habitsQueryKey,
      });

      const previousLogs =
        queryClient.getQueryData<HabitsState>(habitsQueryKey);

      queryClient.setQueryData(
        habitsQueryKey,
        (oldData: HabitsState | undefined) => {
          if (!oldData) return oldData;

          const newHabits = { ...oldData };
          const habitToChange = newHabits.byId[updatedLog.habitId];

          if (habitToChange) {
            const log = habitToChange.logs.find(
              (log) => log._id === updatedLog._id,
            );

            if (log) {
              Object.assign(log, updatedLog);
            }
          }

          return newHabits;
        },
      );

      return { previousLogs };
    },

    onError: (_err, _, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData(habitsQueryKey, context.previousLogs);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const useCreateHabitLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHabitLogRequest) =>
      client.post("/habit-logs", payload),

    onMutate: async (newLog) => {
      await queryClient.cancelQueries({
        queryKey: habitsQueryKey,
      });

      const previousLogs =
        queryClient.getQueryData<HabitsState>(habitsQueryKey);

      queryClient.setQueryData(
        habitsQueryKey,
        (oldData: HabitsState | undefined) => {
          if (!oldData) return oldData;

          const newHabits = { ...oldData };
          const habitToChange = newHabits.byId[newLog.habitId];

          if (habitToChange) {
            const tempId = `temp-${Date.now()}`;

            habitToChange.logs.push({
              ...newLog,
              _id: tempId,
            });
          }

          return newHabits;
        },
      );

      return { previousLogs };
    },

    onError: (_err, _, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData(habitsQueryKey, context.previousLogs);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: habitsQueryKey,
      });
    },
  });
};

export const habitsApi = {
  useGetHabitsQuery,
  useGetHabitQuery,
  useUpdateHabitMutation,
  useCreateHabitMutation,
  useReorderHabitsMutation,
  useDeleteHabitMutation,
  useUpdateHabitLogMutation,
  useCreateHabitLogMutation,
};

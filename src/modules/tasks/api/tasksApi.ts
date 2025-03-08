import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "store/api/client";

import {
  CreateGroupRequest,
  CreateGroupResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskRequest,
  GroupItem,
  GroupsState,
  TaskItem,
  TasksState,
  UpdateGroupRequest,
  UpdateTaskRequest,
} from "../types";

export const getGroupsQueryKey = (userId: string) => ["groups", userId];
export const getTasksQueryKey = (userId: string) => ["tasks", userId];

export const useGroups = (userId: string) => {
  return useQuery({
    queryKey: getGroupsQueryKey(userId),
    queryFn: async () => {
      const { data } = await client.get<GroupItem[]>(`/groups/${userId}`);

      return data.reduce<GroupsState>(
        (acc, group) => {
          acc.byId[group._id] = group;
          acc.allIds.push(group._id);

          return acc;
        },
        { byId: {}, allIds: [] },
      );
    },
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupRequest) =>
      client.post<CreateGroupResponse>("/groups/create", payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: getGroupsQueryKey(payload.author),
      });

      const previousGroups = queryClient.getQueryData<GroupsState>(
        getGroupsQueryKey(payload.author),
      );
      const tempId = `temp-${Date.now()}`;
      const tempGroup = { ...payload, _id: tempId };

      queryClient.setQueryData(
        getGroupsQueryKey(payload.author),
        (oldData?: GroupsState) => {
          if (!oldData) return oldData;

          return {
            byId: { ...oldData.byId, [tempId]: tempGroup },
            allIds: [...oldData.allIds, tempId],
          };
        },
      );

      return { previousGroups, tempId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(
        getGroupsQueryKey(variables.author),
        (oldData?: GroupsState) => {
          if (!oldData) return oldData;
          const { group } = data.data;
          const { tempId } = context!;

          const newById = { ...oldData.byId, [group._id]: group };

          delete newById[tempId];

          return {
            byId: newById,
            allIds: oldData.allIds.map((id) =>
              id === tempId ? group._id : id,
            ),
          };
        },
      );
    },
    onError: (_error, variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(
          getGroupsQueryKey(variables.author),
          context.previousGroups,
        );
      }
    },
  });
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGroupRequest) =>
      client.patch(`/groups/update/${payload._id}`, payload),
    onMutate: async (updatedGroup) => {
      await queryClient.cancelQueries({
        queryKey: getGroupsQueryKey(updatedGroup.author),
      });

      const previousGroups = queryClient.getQueryData<GroupsState>(
        getGroupsQueryKey(updatedGroup.author),
      );

      queryClient.setQueryData(
        getGroupsQueryKey(updatedGroup.author),
        (oldData?: GroupsState) => {
          if (!oldData) return oldData;
          const newGroups = JSON.parse(JSON.stringify(oldData));
          const group = newGroups.byId[updatedGroup._id];

          if (group) {
            Object.assign(group, updatedGroup);
          }

          return newGroups;
        },
      );

      return { previousGroups };
    },
    onError: (_error, updatedGroup, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(
          getGroupsQueryKey(updatedGroup.author),
          context.previousGroups,
        );
      }
    },
    onSettled: (_, __, updatedGroup) => {
      queryClient.invalidateQueries({
        queryKey: getGroupsQueryKey(updatedGroup.author),
      });
    },
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteTaskRequest) => client.delete(`/groups/${_id}`),
    onMutate: async ({ _id, author }) => {
      await queryClient.cancelQueries({ queryKey: getGroupsQueryKey(author) });

      const previousGroups = queryClient.getQueryData<GroupsState>(
        getGroupsQueryKey(author),
      );

      queryClient.setQueryData(
        getGroupsQueryKey(author),
        (oldData?: GroupsState) => {
          if (!oldData) return oldData;
          const newById = { ...oldData.byId };

          delete newById[_id];

          return {
            byId: newById,
            allIds: oldData.allIds.filter((id) => id !== _id),
          };
        },
      );

      return { previousGroups };
    },
    onError: (_error, { author }, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(
          getGroupsQueryKey(author),
          context.previousGroups,
        );
      }
    },
    onSettled: (_, __, { author }) => {
      queryClient.invalidateQueries({ queryKey: getGroupsQueryKey(author) });
    },
  });
};

export const useTasks = (userId: string) => {
  return useQuery({
    queryKey: getTasksQueryKey(userId),
    queryFn: async () => {
      const { data } = await client.get<TaskItem[]>(`/tasks/${userId}`);

      return data.reduce<TasksState>(
        (acc, task) => {
          acc.byId[task._id] = task;
          acc.allIds.push(task._id);

          return acc;
        },
        { byId: {}, allIds: [] },
      );
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequest) =>
      client.post<CreateTaskResponse>("/tasks/create", payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: getTasksQueryKey(payload.author),
      });

      const previousTasks = queryClient.getQueryData<TasksState>(
        getTasksQueryKey(payload.author),
      );
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...payload, _id: tempId };

      queryClient.setQueryData(
        getTasksQueryKey(payload.author),
        (oldData?: TasksState) => {
          if (!oldData) return oldData;

          return {
            byId: { ...oldData.byId, [tempId]: tempTask },
            allIds: [...oldData.allIds, tempId],
          };
        },
      );

      return { previousTasks, tempId };
    },
    onError: (_error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          getTasksQueryKey(variables.author),
          context.previousTasks,
        );
      }
    },
    onSettled: (_, __, updatedTask) => {
      queryClient.invalidateQueries({
        queryKey: getTasksQueryKey(updatedTask.author),
      });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskRequest) =>
      client.patch(`/tasks/update/${payload._id}`, payload),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: getTasksQueryKey(updatedTask.author),
      });

      const previousTasks = queryClient.getQueryData<TasksState>(
        getTasksQueryKey(updatedTask.author),
      );

      queryClient.setQueryData(
        getTasksQueryKey(updatedTask.author),
        (oldData?: TasksState) => {
          if (!oldData) return oldData;

          const newTasks = JSON.parse(JSON.stringify(oldData));
          const task = newTasks.byId[updatedTask._id];

          if (task) {
            Object.assign(task, updatedTask);
          }

          return newTasks;
        },
      );

      return { previousTasks };
    },
    onError: (_error, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          getTasksQueryKey(updatedTask.author),
          context.previousTasks,
        );
      }
    },
    onSettled: (_, __, updatedTask) => {
      queryClient.invalidateQueries({
        queryKey: getTasksQueryKey(updatedTask.author),
      });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteTaskRequest) => client.delete(`/tasks/${_id}`),
    onMutate: async ({ _id, author }) => {
      await queryClient.cancelQueries({ queryKey: getTasksQueryKey(author) });

      const previousTasks = queryClient.getQueryData<TasksState>(
        getTasksQueryKey(author),
      );

      queryClient.setQueryData(
        getTasksQueryKey(author),
        (oldData?: TasksState) => {
          if (!oldData) return oldData;
          const newById = { ...oldData.byId };

          delete newById[_id];

          return {
            byId: newById,
            allIds: oldData.allIds.filter((id) => id !== _id),
          };
        },
      );

      return { previousTasks };
    },
    onError: (_error, { author }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          getTasksQueryKey(author),
          context.previousTasks,
        );
      }
    },
    onSettled: (_, __, { author }) => {
      queryClient.invalidateQueries({ queryKey: getTasksQueryKey(author) });
    },
  });
};

export const tasksApi = {
  useGroups,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useTasks,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
};

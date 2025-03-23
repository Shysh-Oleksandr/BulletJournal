import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newClient } from "store/api/client";

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

export const groupsQueryKey = ["groups"];
export const tasksQueryKey = ["tasks"];

export const useGroups = () => {
  return useQuery({
    queryKey: groupsQueryKey,
    queryFn: async () => {
      const { data } = await newClient.get<GroupItem[]>(`/groups`);

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
      newClient.post<CreateGroupResponse>("/groups", payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: groupsQueryKey,
      });

      const previousGroups =
        queryClient.getQueryData<GroupsState>(groupsQueryKey);
      const tempId = `temp-${Date.now()}`;
      const tempGroup = { ...payload, _id: tempId };

      queryClient.setQueryData(groupsQueryKey, (oldData?: GroupsState) => {
        if (!oldData) return oldData;

        return {
          byId: { ...oldData.byId, [tempId]: tempGroup },
          allIds: [...oldData.allIds, tempId],
        };
      });

      return { previousGroups, tempId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(groupsQueryKey, (oldData?: GroupsState) => {
        if (!oldData) return oldData;
        const { group } = data.data;
        const { tempId } = context!;

        const newById = { ...oldData.byId, [group._id]: group };

        delete newById[tempId];

        return {
          byId: newById,
          allIds: oldData.allIds.map((id) => (id === tempId ? group._id : id)),
        };
      });
    },
    onError: (_error, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(groupsQueryKey, context.previousGroups);
      }
    },
  });
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...data }: UpdateGroupRequest) =>
      newClient.put(`/groups/${_id}`, data),
    onMutate: async (updatedGroup) => {
      await queryClient.cancelQueries({
        queryKey: groupsQueryKey,
      });

      const previousGroups =
        queryClient.getQueryData<GroupsState>(groupsQueryKey);

      queryClient.setQueryData(groupsQueryKey, (oldData?: GroupsState) => {
        if (!oldData) return oldData;
        const newGroups = JSON.parse(JSON.stringify(oldData));
        const group = newGroups.byId[updatedGroup._id];

        if (group) {
          Object.assign(group, updatedGroup);
        }

        return newGroups;
      });

      return { previousGroups };
    },
    onError: (_error, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(groupsQueryKey, context.previousGroups);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: groupsQueryKey,
      });
    },
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteTaskRequest) =>
      newClient.delete(`/groups/${_id}`),
    onMutate: async ({ _id }) => {
      await queryClient.cancelQueries({ queryKey: groupsQueryKey });

      const previousGroups =
        queryClient.getQueryData<GroupsState>(groupsQueryKey);

      queryClient.setQueryData(groupsQueryKey, (oldData?: GroupsState) => {
        if (!oldData) return oldData;
        const newById = { ...oldData.byId };

        delete newById[_id];

        return {
          byId: newById,
          allIds: oldData.allIds.filter((id) => id !== _id),
        };
      });

      return { previousGroups };
    },
    onError: (_error, _, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(groupsQueryKey, context.previousGroups);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey });
    },
  });
};

export const useTasks = () => {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: async () => {
      const { data } = await newClient.get<TaskItem[]>(`/tasks`);

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
      newClient.post<CreateTaskResponse>("/tasks", payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: tasksQueryKey,
      });

      const previousTasks = queryClient.getQueryData<TasksState>(tasksQueryKey);
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...payload, _id: tempId };

      queryClient.setQueryData(tasksQueryKey, (oldData?: TasksState) => {
        if (!oldData) return oldData;

        return {
          byId: { ...oldData.byId, [tempId]: tempTask },
          allIds: [...oldData.allIds, tempId],
        };
      });

      return { previousTasks, tempId };
    },
    onError: (_error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: tasksQueryKey,
      });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...data }: UpdateTaskRequest) =>
      newClient.put(`/tasks/${_id}`, data),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: tasksQueryKey,
      });

      const previousTasks = queryClient.getQueryData<TasksState>(tasksQueryKey);

      queryClient.setQueryData(tasksQueryKey, (oldData?: TasksState) => {
        if (!oldData) return oldData;

        const newTasks = JSON.parse(JSON.stringify(oldData));
        const task = newTasks.byId[updatedTask._id];

        if (task) {
          Object.assign(task, updatedTask);
        }

        return newTasks;
      });

      return { previousTasks };
    },
    onError: (_error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: tasksQueryKey,
      });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id }: DeleteTaskRequest) =>
      newClient.delete(`/tasks/${_id}`),
    onMutate: async ({ _id }) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });

      const previousTasks = queryClient.getQueryData<TasksState>(tasksQueryKey);

      queryClient.setQueryData(tasksQueryKey, (oldData?: TasksState) => {
        if (!oldData) return oldData;
        const newById = { ...oldData.byId };

        delete newById[_id];

        return {
          byId: newById,
          allIds: oldData.allIds.filter((id) => id !== _id),
        };
      });

      return { previousTasks };
    },
    onError: (_error, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
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

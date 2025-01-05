import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

import {
  CreateGroupRequest,
  CreateGroupResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  GroupItem,
  GroupsState,
  TaskItem,
  TasksState,
  UpdateGroupRequest,
  UpdateTaskRequest,
} from "./types";

export const tasksApi = emptyAxiosApi.injectEndpoints({
  endpoints(build) {
    return {
      fetchGroups: build.query<GroupsState, string>({
        query(userId) {
          return {
            url: `/groups/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.GROUPS],
        transformResponse: (res: GroupItem[]) => {
          const byId: Record<string, GroupItem> = {};
          const allIds: string[] = [];

          res.forEach((group) => {
            byId[group._id] = group;
            allIds.push(group._id);
          });

          return { byId, allIds };
        },
      }),
      createGroup: build.mutation<CreateGroupResponse, CreateGroupRequest>({
        query(payload) {
          return {
            url: `/groups/create`,
            method: Method.POST,
            body: payload,
          };
        },
        invalidatesTags: [TAG.GROUPS],
      }),
      updateGroup: build.mutation<void, UpdateGroupRequest>({
        query(payload) {
          return {
            url: `/groups/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        invalidatesTags: [TAG.GROUPS],
      }),
      deleteGroup: build.mutation<void, string>({
        query(groupId) {
          return {
            url: `/groups/${groupId}`,
            method: Method.DELETE,
          };
        },
        invalidatesTags: [TAG.GROUPS],
      }),
      fetchTasks: build.query<TasksState, string>({
        query(userId) {
          return {
            url: `/tasks/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.TASKS],
        transformResponse: (res: TaskItem[]) => {
          const byId: Record<string, TaskItem> = {};
          const allIds: string[] = [];

          res.forEach((task) => {
            byId[task._id] = task;
            allIds.push(task._id);
          });

          return { byId, allIds };
        },
      }),
      createTask: build.mutation<CreateTaskResponse, CreateTaskRequest>({
        query(payload) {
          return {
            url: `/tasks/create`,
            method: Method.POST,
            body: payload,
          };
        },
        invalidatesTags: [TAG.TASKS],
      }),
      updateTask: build.mutation<void, UpdateTaskRequest>({
        query(payload) {
          return {
            url: `/tasks/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        async onQueryStarted(
          { author, _id, ...patch },
          { dispatch, queryFulfilled },
        ) {
          const patchResult = dispatch(
            tasksApi.util.updateQueryData("fetchTasks", author, (draft) => {
              const task = draft.byId[_id];

              if (task) {
                Object.assign(task, patch);
              }
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      deleteTask: build.mutation<void, string>({
        query(groupId) {
          return {
            url: `/tasks/${groupId}`,
            method: Method.DELETE,
          };
        },
        invalidatesTags: [TAG.TASKS],
      }),
    };
  },

  overrideExisting: false,
});

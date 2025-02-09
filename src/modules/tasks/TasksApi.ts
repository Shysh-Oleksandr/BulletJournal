import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

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
        async onQueryStarted(payload, { dispatch, queryFulfilled }) {
          const tempId = `temp-${Date.now()}`;
          const tempGroup = { ...payload, _id: tempId };

          const patchResult = dispatch(
            tasksApi.util.updateQueryData(
              "fetchGroups",
              payload.author,
              (draft) => {
                draft.byId[tempId] = tempGroup;
                draft.allIds.push(tempId);
              },
            ),
          );

          try {
            const {
              data: { group },
            } = await queryFulfilled;

            dispatch(
              tasksApi.util.updateQueryData(
                "fetchGroups",
                payload.author,
                (draft) => {
                  delete draft.byId[tempId];
                  draft.byId[group._id] = group;
                  draft.allIds = draft.allIds.map((id) =>
                    id === tempId ? group._id : id,
                  );
                },
              ),
            );
          } catch {
            patchResult.undo();
          }
        },
      }),
      updateGroup: build.mutation<void, UpdateGroupRequest>({
        query(payload) {
          return {
            url: `/groups/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        async onQueryStarted(payload, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            tasksApi.util.updateQueryData(
              "fetchGroups",
              payload.author,
              (draft) => {
                if (draft.byId[payload._id]) {
                  Object.assign(draft.byId[payload._id], payload);
                }
              },
            ),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
      deleteGroup: build.mutation<void, DeleteTaskRequest>({
        query({ _id }) {
          return {
            url: `/groups/${_id}`,
            method: Method.DELETE,
          };
        },
        async onQueryStarted({ _id, author }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            tasksApi.util.updateQueryData("fetchGroups", author, (draft) => {
              delete draft.byId[_id];
              draft.allIds = draft.allIds.filter((id) => id !== _id);
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
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
        async onQueryStarted(payload, { dispatch, queryFulfilled }) {
          const tempId = `temp-${Date.now()}`;
          const tempTask = { ...payload, _id: tempId };

          const patchResult = dispatch(
            tasksApi.util.updateQueryData(
              "fetchTasks",
              payload.author,
              (draft) => {
                draft.byId[tempId] = tempTask;
                draft.allIds.push(tempId);
              },
            ),
          );

          try {
            const {
              data: { task },
            } = await queryFulfilled;

            dispatch(
              tasksApi.util.updateQueryData(
                "fetchTasks",
                payload.author,
                (draft) => {
                  delete draft.byId[tempId];
                  draft.byId[task._id] = task;
                  draft.allIds = draft.allIds.map((id) =>
                    id === tempId ? task._id : id,
                  );
                },
              ),
            );
          } catch {
            patchResult.undo();
          }
        },
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
      deleteTask: build.mutation<void, DeleteTaskRequest>({
        query({ _id }) {
          return {
            url: `/tasks/${_id}`,
            method: Method.DELETE,
          };
        },
        async onQueryStarted({ _id, author }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            tasksApi.util.updateQueryData("fetchTasks", author, (draft) => {
              delete draft.byId[_id];
              draft.allIds = draft.allIds.filter((id) => id !== _id);
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }),
    };
  },
  overrideExisting: false,
});

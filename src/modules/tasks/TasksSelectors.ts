import createCachedSelector from "re-reselect";

import { RootState } from "../../store/store";

import { tasksApi } from "./TasksApi";

export const getAllGroups = createCachedSelector(
  (state: RootState) =>
    tasksApi.endpoints.fetchGroups.select(state.auth.user!._id)(state),
  (result) => {
    if (!result?.data) return [];

    const { allIds, byId } = result.data;

    return allIds.map((id) => byId[id]);
  },
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getAllTasks = createCachedSelector(
  (state: RootState) =>
    tasksApi.endpoints.fetchTasks.select(state.auth.user!._id)(state),
  (result) => {
    if (!result?.data) return [];

    const { allIds, byId } = result.data;

    return allIds.map((id) => byId[id]);
  },
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getSubGroupsByGroupId = createCachedSelector(
  getAllGroups,
  (_: RootState, groupId: string) => groupId,
  (groups, groupId) =>
    groups.filter((group) => group.parentGroupId === groupId),
)((_: RootState, groupId: string) => groupId);

export const getTasksByGroupId = createCachedSelector(
  getAllTasks,
  (_: RootState, groupId: string) => groupId,
  (tasks, groupId) => tasks.filter((task) => task.groupId === groupId),
)((_: RootState, groupId: string) => groupId);

export const getSubTasksByTaskId = createCachedSelector(
  getAllTasks,
  (_: RootState, taskId: string) => taskId,
  (tasks, taskId) => tasks.filter((task) => task.parentTaskId === taskId),
)((_: RootState, taskId: string) => taskId);

export const getOrphanedGroups = createCachedSelector(getAllGroups, (groups) =>
  groups.filter((group) => !group.parentGroupId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getOrphanedTasks = createCachedSelector(getAllTasks, (tasks) =>
  tasks.filter((task) => !task.groupId && !task.parentTaskId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

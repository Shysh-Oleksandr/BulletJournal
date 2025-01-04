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

export const getAllProjects = createCachedSelector(
  (state: RootState) =>
    tasksApi.endpoints.fetchProjects.select(state.auth.user!._id)(state),
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

export const getProjectsByGroupId = createCachedSelector(
  getAllProjects,
  (_: RootState, groupId: string) => groupId,
  (projects, groupId) =>
    projects.filter((project) => project.groupId === groupId),
)((_: RootState, groupId: string) => groupId);

export const getTasksByProjectId = createCachedSelector(
  getAllTasks,
  (_: RootState, projectId: string) => projectId,
  (tasks, projectId) => tasks.filter((task) => task.projectId === projectId),
)((_: RootState, projectId: string) => projectId);

export const getSubTasksByTaskId = createCachedSelector(
  getAllTasks,
  (_: RootState, taskId: string) => taskId,
  (tasks, taskId) => tasks.filter((task) => task.parentTaskId === taskId),
)((_: RootState, taskId: string) => taskId);

export const getOrphanedGroups = createCachedSelector(getAllGroups, (groups) =>
  groups.filter((group) => !group.parentGroupId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getOrphanedProjects = createCachedSelector(
  getAllProjects,
  (projects) => projects.filter((project) => !project.groupId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getOrphanedTasks = createCachedSelector(getAllTasks, (tasks) =>
  tasks.filter((task) => !task.projectId && !task.parentTaskId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

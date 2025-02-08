import { isPast, isWithinInterval } from "date-fns";
import createCachedSelector from "re-reselect";

import { RootState } from "../../store/store";

import { tasksApi } from "./TasksApi";
import { GroupItem, TaskItem } from "./types";
import { calculateTasksCountInfo } from "./utils/calculateTasksCountInfo";

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

    return allIds
      .map((id) => byId[id])
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;

        return a.dueDate - b.dueDate;
      });
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

export const getArchivedTasksByGroupId = createCachedSelector(
  getAllTasks,
  (_: RootState, groupId: string) => groupId,
  (tasks, groupId) =>
    tasks.filter((task) => task.groupId === groupId && task.isArchived),
)((_: RootState, groupId: string) => groupId);

export const getUnarchivedTasksByGroupId = createCachedSelector(
  getAllTasks,
  (_: RootState, groupId: string) => groupId,
  (tasks, groupId) =>
    tasks.filter((task) => task.groupId === groupId && !task.isArchived),
)((_: RootState, groupId: string) => groupId);

export const getTaskPath = createCachedSelector(
  [
    (state: RootState) => getAllGroups(state),
    (state: RootState) => getAllTasks(state),
    (_: RootState, taskId: string) => taskId,
    (_: RootState, _taskId: string, includeCurrentTask: boolean) =>
      includeCurrentTask,
  ],
  (groups, tasks, taskId, includeCurrentTask) => {
    const taskMap = new Map(tasks.map((task) => [task._id, task]));
    const groupMap = new Map(groups.map((group) => [group._id, group]));

    const buildPath = (
      itemId: string | null | undefined,
      isTask = true,
      includeCurrent = false,
    ): string[] => {
      if (!itemId) return [];
      const map = isTask ? taskMap : groupMap;
      const item = map.get(itemId);

      if (!item) return [];
      const parentId = isTask
        ? (item as TaskItem).parentTaskId || (item as TaskItem).groupId
        : (item as GroupItem).parentGroupId;

      const currentName = includeCurrent ? [item.name] : [];

      return [
        ...buildPath(parentId, !isTask && !parentId, true),
        ...currentName,
      ];
    };

    const task = taskMap.get(taskId);

    if (!task) return "";

    // Determine the starting point for the path
    const parentId = task.parentTaskId || task.groupId;

    // Build path excluding or including the current task's name based on `includeCurrentTask`
    const path = parentId
      ? buildPath(parentId, !!task.parentTaskId, true)
      : includeCurrentTask
        ? [task.name]
        : [];

    // Add the current task's name if needed
    if (includeCurrentTask && task.name) {
      path.push(task.name);
    }

    return path.length > 0 ? `${path.join(" > ")} >` : "";
  },
)(
  (_: RootState, taskId: string, includeCurrentTask: boolean) =>
    `${taskId}_${includeCurrentTask}`,
);

export const getGroupPath = createCachedSelector(
  [
    (state: RootState) => getAllGroups(state),
    (_: RootState, groupId: string) => groupId,
    (_: RootState, _groupId: string, includeCurrentGroup: boolean) =>
      includeCurrentGroup,
  ],
  (groups, groupId, includeCurrentGroup) => {
    const groupMap = new Map(groups.map((group) => [group._id, group]));

    const buildPath = (
      groupId: string | null | undefined,
      includeCurrent = false,
    ): string[] => {
      if (!groupId) return [];
      const group = groupMap.get(groupId);

      if (!group) return [];
      const parentGroupId = group.parentGroupId;

      const currentName = includeCurrent ? [group.name] : [];

      return [...buildPath(parentGroupId, true), ...currentName];
    };

    const group = groupMap.get(groupId);

    if (!group) return "";

    // Build path excluding or including the current group's name based on `includeCurrentGroup`
    const path = buildPath(groupId, includeCurrentGroup).join(" > ");

    return path ? `${path} >` : "";
  },
)(
  (_: RootState, groupId: string, includeCurrentGroup: boolean) =>
    `${groupId}_${includeCurrentGroup}`,
);

export const getTasksCountInfoByGroupId = createCachedSelector(
  getUnarchivedTasksByGroupId,
  calculateTasksCountInfo,
)((_: RootState, groupId: string) => groupId);

export const getArchivedTasksCountInfoByGroupId = createCachedSelector(
  getArchivedTasksByGroupId,
  calculateTasksCountInfo,
)((_: RootState, groupId: string) => groupId);

export const getSubTasksByTaskId = createCachedSelector(
  getAllTasks,
  (_: RootState, taskId: string) => taskId,
  (tasks, taskId) => tasks.filter((task) => task.parentTaskId === taskId),
)((_: RootState, taskId: string) => taskId);

export const getSubTasksCountInfoByTaskId = createCachedSelector(
  getSubTasksByTaskId,
  calculateTasksCountInfo,
)((_: RootState, taskId: string) => taskId);

export const getOrphanedGroups = createCachedSelector(getAllGroups, (groups) =>
  groups.filter((group) => !group.parentGroupId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getAllOrphanedTasks = createCachedSelector(getAllTasks, (tasks) =>
  tasks.filter((task) => !task.groupId && !task.parentTaskId),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getOrphanedTasks = createCachedSelector(getAllTasks, (tasks) =>
  tasks.filter(
    (task) => !task.groupId && !task.parentTaskId && !task.isArchived,
  ),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getArchivedTasks = createCachedSelector(getAllTasks, (tasks) =>
  tasks.filter((task) => task.isArchived),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getTasksWithoutDueDate = createCachedSelector(
  getAllTasks,
  (tasks) => tasks.filter((task) => !task.dueDate),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getCompletedPastTasks = createCachedSelector(
  getAllTasks,
  (tasks) =>
    tasks.filter(
      (task) => task.isCompleted && task.dueDate && isPast(task.dueDate),
    ),
)((state: RootState) => state.auth.user?._id ?? "no_user");

export const getTasksWithinPeriod = createCachedSelector(
  getAllTasks,
  (_: RootState, startDate: number, endDate: number) => ({
    startDate,
    endDate,
  }),
  (tasks, { startDate, endDate }) =>
    tasks.filter(
      (task) =>
        !task.isArchived &&
        task.dueDate &&
        (!task.isCompleted || startDate > 0) &&
        isWithinInterval(task.dueDate, { start: startDate, end: endDate }),
    ),
)((_, startDate, endDate) => `${startDate}-${endDate}`);

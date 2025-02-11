import { isWithinInterval } from "date-fns";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { GroupItem, TaskItem } from "../types";
import { calculateTasksCountInfo } from "../utils/calculateTasksCountInfo";

import { useGroups, useTasks } from "./tasksApi";

export const useAllGroups = () => {
  const userId = useAppSelector(getUserId);

  const { data, isLoading, isError } = useGroups(userId);

  const allGroups = data?.allIds.map((id) => data.byId[id]) || [];

  return { allGroups, isLoading, isError };
};

export const useAllTasks = () => {
  const userId = useAppSelector(getUserId);

  const { data, isLoading, isError } = useTasks(userId);

  const allTasks = data?.allIds.map((id) => data.byId[id]) || [];

  return { allTasks, isLoading, isError };
};

export const useSubGroupsByGroupId = (groupId: string) => {
  const { allGroups, isLoading, isError } = useAllGroups();

  const subGroups = allGroups.filter(
    (group) => group.parentGroupId === groupId,
  );

  return { subGroups, isLoading, isError };
};

export const useOrphanedGroups = () => {
  const { allGroups, isLoading, isError } = useAllGroups();

  const orphanedGroups = allGroups.filter((group) => !group.parentGroupId);

  return { orphanedGroups, isLoading, isError };
};

export const useAllOrphanedTasks = () => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const allOrphanedTasks = allTasks.filter(
    (task) => !task.groupId && !task.parentTaskId,
  );

  return { allOrphanedTasks, isLoading, isError };
};

export const useOrphanedTasks = () => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const orphanedTasks = allTasks.filter(
    (task) => !task.groupId && !task.parentTaskId && !task.isArchived,
  );

  return { orphanedTasks, isLoading, isError };
};

export const useSubTasksByTaskId = (taskId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const subTasks = allTasks.filter((task) => task.parentTaskId === taskId);

  return { subTasks, isLoading, isError };
};

export const useTasksByGroupId = (groupId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const tasks = allTasks.filter((task) => task.groupId === groupId);

  return { tasks, isLoading, isError };
};

export const useArchivedTasksByGroupId = (groupId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const archivedTasks: TaskItem[] = [];
  const unArchivedTasks: TaskItem[] = [];

  allTasks.forEach((task) => {
    if (task.groupId === groupId) {
      if (task.isArchived) {
        archivedTasks.push(task);
      } else {
        unArchivedTasks.push(task);
      }
    }
  });

  return { archivedTasks, unArchivedTasks, isLoading, isError };
};

export const useTaskPath = (taskId?: string, includeCurrentTask?: boolean) => {
  const { allTasks } = useAllTasks();
  const { allGroups } = useAllGroups();

  if (!taskId) return "";

  const taskMap = new Map(allTasks.map((task) => [task._id, task]));
  const groupMap = new Map(allGroups.map((group) => [group._id, group]));

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

    return [...buildPath(parentId, !isTask && !parentId, true), ...currentName];
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
};

export const useGroupPath = (
  groupId?: string,
  includeCurrentGroup?: boolean,
) => {
  const { allGroups } = useAllGroups();

  if (!groupId) return "";

  const groupMap = new Map(allGroups.map((group) => [group._id, group]));

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
};

export const useTasksCountInfoByGroupId = (
  groupId: string,
  onlyArchived?: boolean,
) => {
  const { archivedTasks, unArchivedTasks } = useArchivedTasksByGroupId(groupId);

  return calculateTasksCountInfo(
    onlyArchived ? archivedTasks : unArchivedTasks,
  );
};

export const useTasksWithinPeriod = (startDate: number, endDate: number) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const tasks = allTasks.filter(
    (task) =>
      !task.isArchived &&
      task.dueDate &&
      (!task.isCompleted || startDate > 0) &&
      isWithinInterval(task.dueDate, { start: startDate, end: endDate }),
  );

  return { tasks, isLoading, isError };
};

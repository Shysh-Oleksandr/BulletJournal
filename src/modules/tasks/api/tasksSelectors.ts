import { isWithinInterval } from "date-fns";
import { useCallback, useMemo } from "react";

import { GroupItem, TaskItem } from "../types";
import { calculateTasksCountInfo } from "../utils/calculateTasksCountInfo";

import { useGroups, useTasks } from "./tasksApi";

export const useAllGroups = () => {
  const { data, isLoading, isError } = useGroups();

  const allGroups = useMemo(
    () => data?.allIds.map((id) => data.byId[id]) || [],
    [data],
  );

  return { allGroups, isLoading, isError };
};

export const useAllTasks = () => {
  const { data, isLoading, isError } = useTasks();

  const allTasks = useMemo(
    () => data?.allIds.map((id) => data.byId[id]) || [],
    [data],
  );

  return { allTasks, isLoading, isError };
};

export const useSubGroupsByGroupId = (groupId: string) => {
  const { allGroups, isLoading, isError } = useAllGroups();

  const subGroups = useMemo(
    () => allGroups.filter((group) => group.parentGroupId === groupId),
    [allGroups, groupId],
  );

  return { subGroups, isLoading, isError };
};

export const useOrphanedGroups = () => {
  const { allGroups, isLoading, isError } = useAllGroups();

  const orphanedGroups = useMemo(
    () => allGroups.filter((group) => !group.parentGroupId),
    [allGroups],
  );

  return { orphanedGroups, isLoading, isError };
};

export const useAllOrphanedTasks = () => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const allOrphanedTasks = useMemo(
    () => allTasks.filter((task) => !task.groupId && !task.parentTaskId),
    [allTasks],
  );

  return { allOrphanedTasks, isLoading, isError };
};

export const useOrphanedTasks = () => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const orphanedTasks = useMemo(
    () =>
      allTasks.filter(
        (task) => !task.groupId && !task.parentTaskId && !task.isArchived,
      ),
    [allTasks],
  );

  return { orphanedTasks, isLoading, isError };
};

export const useSubTasksByTaskId = (taskId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const subTasks = useMemo(
    () => allTasks.filter((task) => task.parentTaskId === taskId),
    [allTasks, taskId],
  );

  return { subTasks, isLoading, isError };
};

export const useTasksByGroupId = (groupId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const tasks = useMemo(
    () => allTasks.filter((task) => task.groupId === groupId),
    [allTasks, groupId],
  );

  return { tasks, isLoading, isError };
};

export const useArchivedTasksByGroupId = (groupId: string) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const { archivedTasks, unArchivedTasks } = useMemo(() => {
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

    return { archivedTasks, unArchivedTasks };
  }, [allTasks, groupId]);

  return { archivedTasks, unArchivedTasks, isLoading, isError };
};

export const useTaskPath = (
  taskId?: string,
  includeCurrentTask?: boolean,
  tempParentId?: string | null,
) => {
  const { allTasks } = useAllTasks();
  const { allGroups } = useAllGroups();

  const taskMap = useMemo(
    () => new Map(allTasks.map((task) => [task._id, task])),
    [allTasks],
  );

  const groupMap = useMemo(
    () => new Map(allGroups.map((group) => [group._id, group])),
    [allGroups],
  );

  const buildPath = useCallback(
    (itemId: string | null | undefined, isTask = true): string[] => {
      if (!itemId) return [];
      const map = isTask ? taskMap : groupMap;
      const item = map.get(itemId);

      if (!item) return [];

      const parentId = isTask
        ? (item as TaskItem).parentTaskId || (item as TaskItem).groupId
        : (item as GroupItem).parentGroupId;

      return [
        ...buildPath(parentId, Boolean(parentId && taskMap.has(parentId))),
        item.name,
      ];
    },
    [taskMap, groupMap],
  );

  const task = taskId ? taskMap.get(taskId) : null;

  const isTaskParent = tempParentId ? taskMap.has(tempParentId) : false;

  const path = useMemo(
    () => (tempParentId ? buildPath(tempParentId, isTaskParent) : []),
    [tempParentId, isTaskParent, buildPath],
  );

  if (!tempParentId) return [];

  if (includeCurrentTask && task && task.name) {
    path.push(task.name);
  }

  return path;
};

export const useGroupPath = (
  groupId?: string,
  includeCurrentGroup?: boolean,
  tempParentGroupId?: string | null,
) => {
  const { allGroups } = useAllGroups();

  const groupMap = useMemo(
    () => new Map(allGroups.map((group) => [group._id, group])),
    [allGroups],
  );

  const buildPath = useCallback(
    (groupId: string | null | undefined): string[] => {
      if (!groupId) return [];
      const group = groupMap.get(groupId);

      if (!group) return [];

      return [...buildPath(group.parentGroupId), group.name];
    },
    [groupMap],
  );

  const group = groupId ? groupMap.get(groupId) : null;

  const path = useMemo(
    () => buildPath(tempParentGroupId),
    [buildPath, tempParentGroupId],
  );

  if (!tempParentGroupId) return [];

  if (includeCurrentGroup && group && group.name) {
    path.push(group.name);
  }

  return path;
};

export const useTasksCountInfoByGroupId = (
  groupId: string,
  onlyArchived?: boolean,
) => {
  const { archivedTasks, unArchivedTasks } = useArchivedTasksByGroupId(groupId);

  return useMemo(
    () =>
      calculateTasksCountInfo(onlyArchived ? archivedTasks : unArchivedTasks),
    [archivedTasks, onlyArchived, unArchivedTasks],
  );
};

export const useTasksWithinPeriod = (startDate: number, endDate: number) => {
  const { allTasks, isLoading, isError } = useAllTasks();

  const tasks = useMemo(
    () =>
      allTasks.filter(
        (task) =>
          !task.isArchived &&
          task.dueDate &&
          (!task.isCompleted || startDate > 0) &&
          isWithinInterval(task.dueDate, { start: startDate, end: endDate }),
      ),
    [allTasks, endDate, startDate],
  );

  return { tasks, isLoading, isError };
};

import { useEffect } from "react";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../TasksApi";

export const useFetchTaskElements = () => {
  const userId = useAppSelector(getUserId);
  const [fetchGroups, { isLoading: isGroupsLoading, isUninitialized }] =
    tasksApi.useLazyFetchGroupsQuery();
  const [fetchProjects, { isLoading: isProjectsLoading }] =
    tasksApi.useLazyFetchProjectsQuery();
  const [fetchTasks, { isLoading: isTasksLoading }] =
    tasksApi.useLazyFetchTasksQuery();

  const isLoading =
    isGroupsLoading || isProjectsLoading || isTasksLoading || isUninitialized;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) return;

      Promise.all([
        fetchGroups(userId),
        fetchProjects(userId),
        fetchTasks(userId),
      ]);
    };

    fetchInitialData();
  }, [fetchGroups, fetchProjects, fetchTasks, userId]);

  return isLoading;
};

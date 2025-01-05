import { useEffect } from "react";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../TasksApi";

export const useFetchTaskElements = () => {
  const userId = useAppSelector(getUserId);
  const [fetchGroups, { isLoading: isGroupsLoading, isUninitialized }] =
    tasksApi.useLazyFetchGroupsQuery();
  const [fetchTasks, { isLoading: isTasksLoading }] =
    tasksApi.useLazyFetchTasksQuery();

  const isLoading = isGroupsLoading || isTasksLoading || isUninitialized;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) return;

      Promise.all([fetchGroups(userId), fetchTasks(userId)]);
    };

    fetchInitialData();
  }, [fetchGroups, fetchTasks, userId]);

  return isLoading;
};

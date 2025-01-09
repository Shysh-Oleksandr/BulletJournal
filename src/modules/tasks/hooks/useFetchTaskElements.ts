import { useCallback, useEffect, useMemo } from "react";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../TasksApi";

export const useFetchTaskElements = () => {
  const userId = useAppSelector(getUserId);
  const [
    fetchGroups,
    {
      isLoading: isGroupsLoading,
      isUninitialized,
      isFetching: isGroupsFetching,
    },
  ] = tasksApi.useLazyFetchGroupsQuery();
  const [
    fetchTasks,
    { isLoading: isTasksLoading, isFetching: isTasksFetching },
  ] = tasksApi.useLazyFetchTasksQuery();

  const isLoading = isGroupsLoading || isTasksLoading || isUninitialized;
  const isFetching = isGroupsFetching || isTasksFetching;

  const fetchInitialData = useCallback(async () => {
    if (!userId) return;

    Promise.all([fetchGroups(userId), fetchTasks(userId)]);
  }, [fetchGroups, fetchTasks, userId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return useMemo(
    () => ({ fetchInitialData, isLoading, isFetching }),
    [fetchInitialData, isFetching, isLoading],
  );
};

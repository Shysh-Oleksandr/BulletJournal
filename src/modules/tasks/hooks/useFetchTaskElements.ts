import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const userId = useAppSelector(getUserId);
  const { isLoading: isGroupsLoading } = tasksApi.useGroups(userId);
  const { isLoading: isTasksLoading } = tasksApi.useTasks(userId);

  const isLoading = isGroupsLoading || isTasksLoading;

  return isLoading;
};

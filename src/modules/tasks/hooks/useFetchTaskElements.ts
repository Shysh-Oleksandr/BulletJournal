import { useAuth } from "modules/auth/AuthContext";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const userId = useAuth().userId;
  const { isLoading: isGroupsLoading } = tasksApi.useGroups(userId);
  const { isLoading: isTasksLoading } = tasksApi.useTasks(userId);

  const isLoading = isGroupsLoading || isTasksLoading;

  return isLoading;
};

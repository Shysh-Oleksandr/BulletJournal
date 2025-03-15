import { useAuth } from "modules/auth/AuthContext";
import { customLabelsApi } from "modules/customLabels/api/customLabelsApi";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const userId = useAuth().userId;
  const { isLoading: isGroupsLoading } = tasksApi.useGroups(userId);
  const { isLoading: isTasksLoading } = tasksApi.useTasks(userId);
  const { isLoading: isLabelsLoading } = customLabelsApi.useLabelsQuery(
    userId,
    "Task",
  );

  const isLoading = isGroupsLoading || isTasksLoading || isLabelsLoading;

  return isLoading;
};

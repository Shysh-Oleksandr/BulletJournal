import { useAuth } from "modules/auth/AuthContext";
import { useCustomLabels } from "modules/customLabels/api/customLabelsSelectors";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const userId = useAuth().userId;
  const { isLoading: isGroupsLoading } = tasksApi.useGroups(userId);
  const { isLoading: isTasksLoading } = tasksApi.useTasks(userId);
  const { isLoading: isLabelsLoading } = useCustomLabels("Task");

  const isLoading = isGroupsLoading || isTasksLoading || isLabelsLoading;

  return isLoading;
};

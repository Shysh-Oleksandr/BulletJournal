import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { useCustomLabels } from "modules/customLabels/api/customLabelsSelectors";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const userId = useAuthStore((state) => state.userId);
  const { isLoading: isGroupsLoading } = tasksApi.useGroups(userId);
  const { isLoading: isTasksLoading } = tasksApi.useTasks(userId);
  const { isLoading: isLabelsLoading } = useCustomLabels("Task");

  const isLoading = isGroupsLoading || isTasksLoading || isLabelsLoading;

  return isLoading;
};

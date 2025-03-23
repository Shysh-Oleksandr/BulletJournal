import { useCustomLabels } from "modules/customLabels/api/customLabelsSelectors";

import { tasksApi } from "../api/tasksApi";

export const useFetchTaskElements = () => {
  const { isLoading: isGroupsLoading } = tasksApi.useGroups();
  const { isLoading: isTasksLoading } = tasksApi.useTasks();
  const { isLoading: isLabelsLoading } = useCustomLabels("Task");

  const isLoading = isGroupsLoading || isTasksLoading || isLabelsLoading;

  return isLoading;
};

import { useAuth } from "modules/auth/AuthContext";

import { useLabelsQuery } from "./customLabelsApi";

export const useNoteLabels = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useLabelsQuery(userId);

  return { labels: data || [], isLoading, isError };
};

export const useTaskLabels = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useLabelsQuery(userId, "Task");

  return { labels: data || [], isLoading, isError };
};

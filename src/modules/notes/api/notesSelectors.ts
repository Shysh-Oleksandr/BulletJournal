import { useAuth } from "modules/auth/AuthContext";

import { useLabelsQuery, useNotesQuery } from "./notesApi";

export const useAllNotes = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useNotesQuery(userId);

  return { notes: data || [], isLoading, isError };
};

export const useAllLabels = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useLabelsQuery(userId);

  return { labels: data || [], isLoading, isError };
};

export const useLabelIds = () => {
  const { labels, isLoading, isError } = useAllLabels();

  return { labelIds: labels.map((label) => label._id), isLoading, isError };
};

export const useCustomTypes = () => {
  const { labels, isLoading, isError } = useAllLabels();

  return {
    customTypes: labels.filter((label) => !label.isCategoryLabel),
    isLoading,
    isError,
  };
};

export const useCustomCategories = () => {
  const { labels, isLoading, isError } = useAllLabels();

  return {
    customCategories: labels.filter((label) => label.isCategoryLabel),
    isLoading,
    isError,
  };
};

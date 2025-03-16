import { useAuth } from "modules/auth/AuthContext";

import { LabelFor } from "../types";

import { useLabelsQuery } from "./customLabelsApi";

export const useNoteLabels = () => {
  const userId = useAuth().userId;

  const {
    data: typeLabels = [],
    isLoading: isTypeLabelsLoading,
    isError: isTypeLabelsError,
  } = useLabelsQuery(userId, "Type");
  const {
    data: categoryLabels = [],
    isLoading: isCategoryLabelsLoading,
    isError: isCategoryLabelsError,
  } = useLabelsQuery(userId, "Category");

  const labels = [...typeLabels, ...categoryLabels];
  const isLoading = isTypeLabelsLoading || isCategoryLabelsLoading;
  const isError = isTypeLabelsError || isCategoryLabelsError;

  return { labels, typeLabels, categoryLabels, isLoading, isError };
};

export const useCustomLabels = (labelFor: LabelFor) => {
  const userId = useAuth().userId;

  const { data = [], isLoading, refetch } = useLabelsQuery(userId, labelFor);

  return { labels: data, isLoading, refetch };
};

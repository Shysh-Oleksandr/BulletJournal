import { LabelFor } from "../types";

import { useLabelsQuery } from "./customLabelsApi";

export const useNoteLabels = () => {
  const {
    data: typeLabels = [],
    isLoading: isTypeLabelsLoading,
    isError: isTypeLabelsError,
  } = useLabelsQuery("Type");
  const {
    data: categoryLabels = [],
    isLoading: isCategoryLabelsLoading,
    isError: isCategoryLabelsError,
  } = useLabelsQuery("Category");

  const labels = [...typeLabels, ...categoryLabels];
  const isLoading = isTypeLabelsLoading || isCategoryLabelsLoading;
  const isError = isTypeLabelsError || isCategoryLabelsError;

  return { labels, typeLabels, categoryLabels, isLoading, isError };
};

export const useCustomLabels = (labelFor: LabelFor) => {
  const { data = [], isLoading, refetch } = useLabelsQuery(labelFor);

  return { labels: data, isLoading, refetch };
};

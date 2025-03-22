import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { client } from "store/api/client";

import {
  CreateLabelRequest,
  CreateLabelResponse,
  FetchLabelsResponse,
  LabelFor,
  UpdateLabelRequest,
} from "../types";

export const getLabelsQueryKey = (userId: string, labelFor: LabelFor) => [
  "labels",
  userId,
  labelFor,
];

export const useLabelsQuery = (userId: string, labelFor: LabelFor) => {
  return useQuery({
    queryKey: getLabelsQueryKey(userId, labelFor),
    queryFn: async () => {
      const { data } = await client.get<FetchLabelsResponse>(
        `/customlabels/${userId}?labelFor=${labelFor}`,
      );

      return data.customLabels;
    },
  });
};

export const useCreateLabelMutation = () => {
  const queryClient = useQueryClient();
  const author = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (payload: CreateLabelRequest) =>
      client.post<CreateLabelResponse>("/customlabels/create", payload),
    onSuccess: (_, { labelFor }) => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(author, labelFor),
      });
    },
  });
};

export const useUpdateLabelMutation = () => {
  const queryClient = useQueryClient();
  const author = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (payload: UpdateLabelRequest) =>
      client.patch(`/customlabels/update/${payload._id}`, payload),
    onSuccess: (_, { labelFor }) => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(author, labelFor),
      });
    },
  });
};

export const useDeleteLabelMutation = (labelFor: LabelFor) => {
  const queryClient = useQueryClient();
  const author = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (labelId: string) => client.delete(`/customlabels/${labelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(author, labelFor),
      });
    },
  });
};

export const customLabelsApi = {
  useLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "store/api/client";

import {
  CreateLabelRequest,
  CreateLabelResponse,
  FetchLabelsResponse,
  LabelFor,
  UpdateLabelRequest,
} from "../types";

export const getLabelsQueryKey = (labelFor: LabelFor) => ["labels", labelFor];

export const useLabelsQuery = (labelFor: LabelFor) => {
  return useQuery({
    queryKey: getLabelsQueryKey(labelFor),
    queryFn: async () => {
      const { data } = await client.get<FetchLabelsResponse>(
        `/custom-labels/user?labelFor=${labelFor}`,
      );

      return data;
    },
  });
};

export const useCreateLabelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLabelRequest) =>
      client.post<CreateLabelResponse>("/custom-labels", payload),
    onSuccess: (_, { labelFor }) => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(labelFor),
      });
    },
  });
};

export const useUpdateLabelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...data }: UpdateLabelRequest) =>
      client.put(`/custom-labels/${_id}`, data),
    onSuccess: (_, { labelFor }) => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(labelFor),
      });
    },
  });
};

export const useDeleteLabelMutation = (labelFor: LabelFor) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelId: string) => client.delete(`/custom-labels/${labelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLabelsQueryKey(labelFor),
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

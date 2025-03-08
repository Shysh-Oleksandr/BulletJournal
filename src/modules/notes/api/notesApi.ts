import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "modules/auth/AuthSlice";
import { client } from "store/api/client";
import { useAppSelector } from "store/helpers/storeHooks";

import {
  CreateImagesRequest,
  CreateImagesResponse,
  CreateLabelRequest,
  CreateLabelResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteImagesRequest,
  FetchLabelsResponse,
  FetchNotesResponse,
  UpdateLabelRequest,
  UpdateNoteRequest,
} from "../types";

export const getNotesQueryKey = (userId: string) => ["notes", userId];
export const getLabelsQueryKey = (userId: string) => ["labels", userId];

export const useNotesQuery = (userId: string) => {
  return useQuery({
    queryKey: getNotesQueryKey(userId),
    queryFn: async () => {
      const { data } = await client.get<FetchNotesResponse>(`/notes/${userId}`);

      return data.notes.sort((a, b) => b.startDate - a.startDate);
    },
  });
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNoteRequest) =>
      client.post<CreateNoteResponse>("/notes/create", payload),
    onSuccess: (_, { author }) => {
      queryClient.invalidateQueries({ queryKey: getNotesQueryKey(author) });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNoteRequest) =>
      client.patch(`/notes/update/${payload._id}`, payload),
    onSuccess: (_, { author }) => {
      queryClient.invalidateQueries({ queryKey: getNotesQueryKey(author) });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  const author = useAppSelector(getUserId);

  return useMutation({
    mutationFn: (noteId: string) => client.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotesQueryKey(author) });
    },
  });
};

export const useLabelsQuery = (userId: string) => {
  return useQuery({
    queryKey: getLabelsQueryKey(userId),
    queryFn: async () => {
      const { data } = await client.get<FetchLabelsResponse>(
        `/customlabels/${userId}`,
      );

      return data.customLabels;
    },
  });
};

export const useCreateLabelMutation = () => {
  const queryClient = useQueryClient();
  const author = useAppSelector(getUserId);

  return useMutation({
    mutationFn: (payload: CreateLabelRequest) =>
      client.post<CreateLabelResponse>("/customlabels/create", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getLabelsQueryKey(author) });
    },
  });
};

export const useUpdateLabelMutation = () => {
  const queryClient = useQueryClient();
  const author = useAppSelector(getUserId);

  return useMutation({
    mutationFn: (payload: UpdateLabelRequest) =>
      client.patch(`/customlabels/update/${payload._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getLabelsQueryKey(author) });
    },
  });
};

export const useDeleteLabelMutation = () => {
  const queryClient = useQueryClient();
  const author = useAppSelector(getUserId);

  return useMutation({
    mutationFn: (labelId: string) => client.delete(`/customlabels/${labelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getLabelsQueryKey(author) });
    },
  });
};

export const useCreateImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateImagesRequest) =>
      client.post<CreateImagesResponse>("/images/create", payload),
  });
};

export const useDeleteImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: DeleteImagesRequest) =>
      client.delete("/images", { data: payload }),
  });
};

export const notesApi = {
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
  useCreateImagesMutation,
  useDeleteImagesMutation,
};

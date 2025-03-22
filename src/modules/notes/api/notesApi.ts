import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { client } from "store/api/client";

import {
  CreateImagesRequest,
  CreateImagesResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteImagesRequest,
  FetchNotesResponse,
  UpdateNoteRequest,
} from "../types";

export const getNotesQueryKey = (userId: string) => ["notes", userId];

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
  const author = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (noteId: string) => client.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getNotesQueryKey(author) });
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
  useCreateImagesMutation,
  useDeleteImagesMutation,
};

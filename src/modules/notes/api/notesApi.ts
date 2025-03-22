import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newClient } from "store/api/client";

import {
  CreateImagesRequest,
  CreateImagesResponse,
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteImagesRequest,
  Note,
  UpdateNoteRequest,
} from "../types";

export const notesQueryKey = ["notes"];

export const useNotesQuery = () => {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: async () => {
      const { data } = await newClient.get<Note[]>(`/notes/user`);

      return data;
    },
  });
};

// TODO: Add useFetchPaginatedNotesQuery

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNoteRequest) =>
      newClient.post<CreateNoteResponse>("/notes", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...data }: UpdateNoteRequest) =>
      newClient.put(`/notes/${_id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => newClient.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useCreateImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateImagesRequest) =>
      newClient.post<CreateImagesResponse>("/images/bulk", payload),
  });
};

export const useDeleteImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: DeleteImagesRequest) =>
      newClient.delete("/images/bulk", { data: payload }),
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

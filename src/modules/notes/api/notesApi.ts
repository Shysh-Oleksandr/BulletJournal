import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "store/api/client";

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
      const { data } = await client.get<Note[]>(`/notes/user`);

      return data;
    },
  });
};

// TODO: Add useFetchPaginatedNotesQuery

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNoteRequest) =>
      client.post<CreateNoteResponse>("/notes", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, ...data }: UpdateNoteRequest) =>
      client.put(`/notes/${_id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => client.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
};

export const useCreateImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateImagesRequest) =>
      client.post<CreateImagesResponse>("/images/bulk", payload),
  });
};

export const useDeleteImagesMutation = () => {
  return useMutation({
    mutationFn: (payload: DeleteImagesRequest) =>
      client.delete("/images/bulk", { data: payload }),
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

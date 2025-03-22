import { useNotesQuery } from "./notesApi";

export const useAllNotes = () => {
  const { data, isLoading, isError } = useNotesQuery();

  return { notes: data || [], isLoading, isError };
};

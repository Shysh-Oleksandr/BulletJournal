import { useAuthStore } from "modules/auth/hooks/useAuthStore";

import { useNotesQuery } from "./notesApi";

export const useAllNotes = () => {
  const userId = useAuthStore((state) => state.userId);

  const { data, isLoading, isError } = useNotesQuery(userId);

  return { notes: data || [], isLoading, isError };
};

import { useAuth } from "modules/auth/AuthContext";

import { useNotesQuery } from "./notesApi";

export const useAllNotes = () => {
  const userId = useAuth().userId;

  const { data, isLoading, isError } = useNotesQuery(userId);

  return { notes: data || [], isLoading, isError };
};

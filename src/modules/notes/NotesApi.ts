import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

import { FetchNotesResponse } from "./types";

export const notesApi = emptyAxiosApi.injectEndpoints({
  endpoints(build) {
    return {
      fetchNotes: build.query<FetchNotesResponse, string>({
        query(userId) {
          return {
            url: `/notes/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.NOTES],
      }),
      updateNote: build.mutation<void, string>({
        query(noteId) {
          return {
            url: `/notes/update/${noteId}`,
            method: Method.PATCH,
          };
        },
        invalidatesTags: [TAG.NOTES],
      }),
      createNote: build.mutation<void, void>({
        query() {
          return {
            url: `/notes/create`,
            method: Method.POST,
          };
        },
        invalidatesTags: [TAG.NOTES],
      }),
    };
  },

  overrideExisting: false,
});

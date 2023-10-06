import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

import {
  CreateNoteRequest,
  FetchNotesResponse,
  UpdateNoteRequest,
} from "./types";

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
      updateNote: build.mutation<void, UpdateNoteRequest>({
        query(payload) {
          return {
            url: `/notes/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        invalidatesTags: [TAG.NOTES],
      }),
      createNote: build.mutation<void, CreateNoteRequest>({
        query(payload) {
          return {
            url: `/notes/create`,
            method: Method.POST,
            body: payload,
          };
        },
        invalidatesTags: [TAG.NOTES],
      }),
      deleteNote: build.mutation<void, string>({
        query(noteId) {
          return {
            url: `/notes/${noteId}`,
            method: Method.DELETE,
          };
        },
        invalidatesTags: [TAG.NOTES],
      }),
    };
  },

  overrideExisting: false,
});

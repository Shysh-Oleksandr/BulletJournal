import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

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
      createNote: build.mutation<CreateNoteResponse, CreateNoteRequest>({
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

      fetchLabels: build.query<FetchLabelsResponse, string>({
        query(userId) {
          return {
            url: `/customlabels/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.LABEL],
      }),
      updateLabel: build.mutation<void, UpdateLabelRequest>({
        query(payload) {
          return {
            url: `/customlabels/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        invalidatesTags: [TAG.LABEL],
      }),
      createLabel: build.mutation<CreateLabelResponse, CreateLabelRequest>({
        query(payload) {
          return {
            url: `/customlabels/create`,
            method: Method.POST,
            body: payload,
          };
        },
        invalidatesTags: [TAG.LABEL],
      }),
      deleteLabel: build.mutation<void, string>({
        query(labelId) {
          return {
            url: `/customlabels/${labelId}`,
            method: Method.DELETE,
          };
        },
        invalidatesTags: [TAG.LABEL],
      }),

      createImages: build.mutation<CreateImagesResponse, CreateImagesRequest>({
        query(payload) {
          return {
            url: `/images/create`,
            method: Method.POST,
            body: payload,
          };
        },
      }),
      deleteImages: build.mutation<void, DeleteImagesRequest>({
        query(payload) {
          return {
            url: `/images`,
            method: Method.DELETE,
            body: payload,
          };
        },
      }),
    };
  },

  overrideExisting: false,
});

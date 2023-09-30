import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method } from "store/models";

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
      }),
    };
  },

  overrideExisting: false,
});

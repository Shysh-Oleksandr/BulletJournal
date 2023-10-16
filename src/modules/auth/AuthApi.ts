import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method } from "store/models";

import { LoginRequest, LoginResponse } from "./types";

export const authApi = emptyAxiosApi.injectEndpoints({
  endpoints(build) {
    return {
      login: build.query<LoginResponse, LoginRequest>({
        query({ fire_token, uid }) {
          return {
            url: `/users/login`,
            method: Method.POST,
            body: {
              uid,
            },
            headers: { Authorization: `Bearer ${fire_token}` },
          };
        },
      }),
    };
  },

  overrideExisting: false,
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import AppConfig from "config/AppConfig";
import { TAG } from "store/models";

const tags = Object.values(TAG);

export const emptyAxiosApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: AppConfig.apiUrl }),
  reducerPath: "axios",
  endpoints: () => ({}),
  tagTypes: tags,
});

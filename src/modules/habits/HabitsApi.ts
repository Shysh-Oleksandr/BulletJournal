import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

import {
  CreateHabitRequest,
  CreateHabitResponse,
  FetchHabitsResponse,
  UpdateHabitRequest,
} from "./types";

export const habitsApi = emptyAxiosApi.injectEndpoints({
  endpoints(build) {
    return {
      fetchHabits: build.query<FetchHabitsResponse, string>({
        query(userId) {
          return {
            url: `/habits/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.HABITS],
      }),
      updateHabit: build.mutation<void, UpdateHabitRequest>({
        query(payload) {
          return {
            url: `/habits/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        invalidatesTags: [TAG.HABITS],
      }),
      createHabit: build.mutation<CreateHabitResponse, CreateHabitRequest>({
        query(payload) {
          return {
            url: `/habits/create`,
            method: Method.POST,
            body: payload,
          };
        },
        invalidatesTags: [TAG.HABITS],
      }),
      deleteHabit: build.mutation<void, string>({
        query(habitId) {
          return {
            url: `/habits/${habitId}`,
            method: Method.DELETE,
          };
        },
        invalidatesTags: [TAG.HABITS],
      }),
    };
  },

  overrideExisting: false,
});

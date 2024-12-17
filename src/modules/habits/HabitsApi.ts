import { emptyAxiosApi } from "store/api/emptyAxiosApi";
import { Method, TAG } from "store/models";

import {
  CreateHabitRequest,
  CreateHabitResponse,
  FetchHabitsResponse,
  Habit,
  HabitsState,
  UpdateHabitRequest,
} from "./types";
import { calculateHabitLogsStatus } from "./utils/calculateHabitLogsStatus";

export const habitsApi = emptyAxiosApi.injectEndpoints({
  endpoints(build) {
    return {
      fetchHabits: build.query<HabitsState, string>({
        query(userId) {
          return {
            url: `/habits/${userId}`,
            method: Method.GET,
          };
        },
        providesTags: [TAG.HABITS],
        transformResponse: (res: FetchHabitsResponse) => {
          const byId: Record<string, Habit> = {};
          const allIds: string[] = [];

          res.habits.forEach((habit) => {
            const { processedLogs, oldestLogDate } =
              calculateHabitLogsStatus(habit);

            byId[habit._id] = {
              ...habit,
              logs: processedLogs,
              oldestLogDate,
            };
            allIds.push(habit._id);
          });

          return { byId, allIds };
        },
      }),
      updateHabit: build.mutation<void, UpdateHabitRequest>({
        query(payload) {
          return {
            url: `/habits/update/${payload._id}`,
            method: Method.PATCH,
            body: payload,
          };
        },
        async onQueryStarted(
          { author, _id, ...patch },
          { dispatch, queryFulfilled },
        ) {
          const patchResult = dispatch(
            habitsApi.util.updateQueryData("fetchHabits", author, (draft) => {
              const habit = draft.byId[_id];

              if (habit) {
                Object.assign(habit, patch);

                const { processedLogs, oldestLogDate } =
                  calculateHabitLogsStatus(habit);

                habit.logs = processedLogs;
                habit.oldestLogDate = oldestLogDate;
              }
            }),
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
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

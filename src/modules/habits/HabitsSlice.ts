import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { logout } from "modules/auth/AuthSlice";

import { RootState } from "../../store/store";

import { habitsApi } from "./HabitsApi";
import { Habit, UpdateHabitLogPayload } from "./types";

export const STATE_KEY = "habits";

export interface HabitsState {
  habits: Habit[];
}

const initialState: HabitsState = {
  habits: [],
};

export const habitsSlice = createSlice({
  name: STATE_KEY,
  initialState: initialState,
  reducers: {
    updateHabitLog: (
      state,
      { payload }: PayloadAction<UpdateHabitLogPayload>,
    ) => {
      state.habits = state.habits.map((habit) => {
        const { habitId, updatedLogs } = payload;

        if (habit._id !== habitId) return habit;

        return {
          ...habit,
          logs: updatedLogs,
        } as Habit;
      });
    },
  },
  extraReducers: (build) => {
    build.addMatcher(logout.match, () => ({
      ...initialState,
    }));
    build.addMatcher(
      habitsApi.endpoints.fetchHabits.matchFulfilled,
      (state, action) => {
        state.habits = action.payload.habits;
      },
    );
  },
});

const HabitsReducer = habitsSlice.reducer;

export const { updateHabitLog } = habitsSlice.actions;

export default HabitsReducer;

// Selectors
export const getHabits = (state: RootState): Habit[] => state[STATE_KEY].habits;

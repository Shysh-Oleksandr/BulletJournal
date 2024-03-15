import { createSlice } from "@reduxjs/toolkit";
import { logout } from "modules/auth/AuthSlice";

import { RootState } from "../../store/store";

import { habitsApi } from "./HabitsApi";
import { Habit } from "./types";

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
  reducers: {},
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

export default HabitsReducer;

// Selectors
export const getHabits = (state: RootState): Habit[] => state[STATE_KEY].habits;

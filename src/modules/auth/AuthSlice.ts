import { isNil } from "ramda";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import { CustomUserEvents } from "modules/app/types";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

import { RootState } from "../../store/store";

import { authApi } from "./AuthApi";
import User from "./types";

export const STATE_KEY = "auth";

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: STATE_KEY,
  initialState: initialState,
  reducers: {
    logout: () => {
      logUserEvent(CustomUserEvents.SIGN_OUT);
      addCrashlyticsLog("User signed out");
      signOut(auth);
      AsyncStorage.clear();

      return {
        ...initialState,
      };
    },
  },
  extraReducers: (build) => {
    build.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { user } = action.payload;

        logUserEvent(CustomUserEvents.SIGN_IN, { uid: user.uid });
        addCrashlyticsLog("User signed in successfully!");

        state.user = user;
      },
    );
  },
});

const AuthReducer = authSlice.reducer;

export const { logout } = authSlice.actions;

export default AuthReducer;

// Selectors
export const getUserData = (state: RootState): User | null =>
  state[STATE_KEY].user;

export const getUserId = (state: RootState): string =>
  state[STATE_KEY].user?._id ?? "";

export const getIsAuthenticated = (state: RootState): boolean =>
  !isNil(state[STATE_KEY].user);

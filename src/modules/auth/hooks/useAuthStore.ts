import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import { CustomUserEvents } from "modules/app/types";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

import User, { ShortUser } from "../types";

interface AuthState {
  user: User | null;
  userId: string;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userId: "",
  initAuth: async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        set({
          user,
          userId: user?._id ?? "",
        });
      }
    } catch (error) {
      console.error("Failed to load user from AsyncStorage", error);
    }
  },

  setUser: (user: User) => {
    const shortUser: ShortUser = {
      _id: user._id,
      uid: user.uid,
      name: user.name,
      access_token: user.access_token,
    };

    AsyncStorage.setItem("user", JSON.stringify(shortUser));

    set({
      user,
      userId: user?._id ?? "",
    });
  },

  logout: async () => {
    try {
      logUserEvent(CustomUserEvents.SIGN_OUT);
      addCrashlyticsLog("User signed out");
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      set({
        user: null,
        userId: "",
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));

// Initialize the auth state when the app starts
export const initializeAuth = () => {
  useAuthStore.getState().initAuth();
};

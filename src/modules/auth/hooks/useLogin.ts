import { useCallback, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomUserEvents } from "modules/app/types";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

import { authApi } from "../api/authApi";
import { ShortUser } from "../types";

import { useAuthStore } from "./useAuthStore";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const { mutateAsync: loginMutation } = authApi.useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (fire_token: string) => {
      try {
        setIsLoading(true);
        const response = await loginMutation({ fire_token });
        const user = response.user;

        setUser(user);

        const shortUser: ShortUser = {
          _id: user._id,
          uid: user.uid,
          name: user.name,
          access_token: user.access_token,
        };

        await AsyncStorage.setItem("user", JSON.stringify(shortUser));

        logUserEvent(CustomUserEvents.SIGN_IN, { uid: response.user.uid });
        addCrashlyticsLog("User signed in successfully!");
      } catch (error) {
        console.error("Login failed", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loginMutation, setUser],
  );

  return { login, isLoading };
};

import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import { CustomUserEvents } from "modules/app/types";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { logUserEvent } from "utils/logUserEvent";

import { authApi } from "./api/authApi";
import User from "./types";

interface AuthContextType {
  user: User | null;
  userId: string;
  login: (fire_token: string, uid: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = authApi.useLoginMutation();

  const userId = user?._id ?? "";

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (fire_token: string, uid: string) => {
    try {
      const response = await loginMutation.mutateAsync({ fire_token, uid });

      logUserEvent(CustomUserEvents.SIGN_IN, { uid: response.user.uid });
      addCrashlyticsLog("User signed in successfully!");

      setUser(response.user);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      logUserEvent(CustomUserEvents.SIGN_OUT);
      addCrashlyticsLog("User signed out");
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

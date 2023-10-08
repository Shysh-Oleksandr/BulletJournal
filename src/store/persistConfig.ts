import { PersistConfig } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AuthState,
  STATE_KEY as AUTH_STATE_KEY,
} from "../modules/auth/AuthSlice";

type CustomPersistConfig<S = Record<string, any>> = Omit<
  PersistConfig<S>,
  "whitelist"
> & {
  whitelist?: Array<keyof S>;
  blacklist?: Array<keyof S>;
};

export const authPersistConfig: CustomPersistConfig<AuthState> = {
  key: AUTH_STATE_KEY,
  storage: AsyncStorage,
  whitelist: ["user"],
};

import { PersistConfig } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  NotesState,
  STATE_KEY as NOTES_STATE_KEY,
} from "../modules/notes/NotesSlice";

type CustomPersistConfig<S = Record<string, any>> = Omit<
  PersistConfig<S>,
  "whitelist"
> & {
  whitelist?: Array<keyof S>;
  blacklist?: Array<keyof S>;
};

export const notesPersistConfig: CustomPersistConfig<NotesState> = {
  key: NOTES_STATE_KEY,
  storage: AsyncStorage,
  // whitelist: ["notes"],
};

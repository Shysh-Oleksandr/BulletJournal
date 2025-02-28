import { persistReducer } from "redux-persist";

import { combineReducers } from "@reduxjs/toolkit";

import AuthReducer, {
  STATE_KEY as AUTH_STATE_KEY,
} from "../modules/auth/AuthSlice";
import NotesReducer, {
  STATE_KEY as NOTES_STATE_KEY,
} from "../modules/notes/NotesSlice";

import { emptyAxiosApi } from "./api/emptyAxiosApi";
import { authPersistConfig } from "./persistConfig";

const rootReducer = combineReducers({
  // App Reducers
  [NOTES_STATE_KEY]: NotesReducer,
  // [HABITS_STATE_KEY]: HabitsReducer,
  [AUTH_STATE_KEY]: persistReducer(authPersistConfig, AuthReducer),
  // RTK query reducers
  [emptyAxiosApi.reducerPath]: emptyAxiosApi.reducer,
});

export default rootReducer;

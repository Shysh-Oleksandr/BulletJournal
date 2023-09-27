import { persistReducer } from "redux-persist";

import { combineReducers } from "@reduxjs/toolkit";

import NotesReducer, {
  STATE_KEY as NOTES_STATE_KEY,
} from "../modules/notes/NotesSlice";

import { emptyAxiosApi } from "./api/emptyAxiosApi";
import { notesPersistConfig } from "./persistConfig";

const rootReducer = combineReducers({
  // App Reducers
  [NOTES_STATE_KEY]: persistReducer(notesPersistConfig, NotesReducer),
  // RTK query reducers
  [emptyAxiosApi.reducerPath]: emptyAxiosApi.reducer,
});

export default rootReducer;

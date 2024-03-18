import createCachedSelector from "re-reselect";

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { logout } from "modules/auth/AuthSlice";

import { RootState } from "../../store/store";

import { notesApi } from "./NotesApi";
import { CustomLabel, Note } from "./types";

export const STATE_KEY = "notes";

export interface NotesState {
  notes: Note[];
  labels: CustomLabel[];
}

const initialState: NotesState = {
  notes: [],
  labels: [],
};

export const notesSlice = createSlice({
  name: STATE_KEY,
  initialState: initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addMatcher(logout.match, () => initialState);
    build.addMatcher(
      notesApi.endpoints.fetchNotes.matchFulfilled,
      (state, action) => {
        state.notes = action.payload.notes.sort(
          (a, b) => b.startDate - a.startDate,
        );
      },
    );
    build.addMatcher(
      notesApi.endpoints.fetchLabels.matchFulfilled,
      (state, action) => {
        state.labels = action.payload.customLabels;
      },
    );
  },
});

const NotesReducer = notesSlice.reducer;

export default NotesReducer;

// Selectors
export const getNotes = (state: RootState): Note[] => state[STATE_KEY].notes;

export const getLabels = (state: RootState): CustomLabel[] =>
  state[STATE_KEY].labels;

export const getLabelsIds = createSelector(getLabels, (labels) =>
  labels.map((label) => label._id),
);

export const getCustomTypes = createSelector(getLabels, (labels) =>
  labels.filter((label) => !label.isCategoryLabel),
);

export const getCustomCategories = createSelector(getLabels, (labels) =>
  labels.filter((label) => label.isCategoryLabel),
);

export const getNoteById = createCachedSelector(
  // Example
  getNotes,
  (_: RootState, noteId: string) => noteId,
  (notes, noteId) => notes.find((note) => note._id === noteId) as Note,
)((_: RootState, noteId: string) => noteId);

import createCachedSelector from "re-reselect";

import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store/store";

import { notesApi } from "./NotesApi";
import { Note } from "./types";

export const STATE_KEY = "notes";

export interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [],
};

export const notesSlice = createSlice({
  name: STATE_KEY,
  initialState: initialState,
  reducers: {
    setNotes: (state, payload: PayloadAction<Note[]>) => {
      state.notes = payload.payload.sort((a, b) => b.startDate - a.startDate);
    },
  },
  extraReducers: (build) => {
    build.addMatcher(
      notesApi.endpoints.fetchNotes.matchFulfilled,
      (state, action) => {
        console.log("new notes:");

        state.notes = action.payload.notes.sort(
          (a, b) => b.startDate - a.startDate,
        );
      },
    );
  },
});

const NotesReducer = notesSlice.reducer;

export const { setNotes } = notesSlice.actions;

export default NotesReducer;

// Selectors
export const getNotes = (state: RootState): Note[] => state[STATE_KEY].notes;

export const getNotesLength = createSelector(getNotes, (notes) => notes.length);

export const getNoteById = createCachedSelector(
  getNotes,
  (_: RootState, noteId: string) => noteId,
  (notes, noteId) => notes.find((note) => note._id === noteId) as Note,
)((_: RootState, noteId: string) => noteId);

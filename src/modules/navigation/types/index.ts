import { Note } from "modules/notes/types";

export enum Routes {
  SIGN_IN = "sign_in",
  NOTES = "notes",
  EDIT_NOTE = "edit_note",
}

export type RootStackParamList = {
  [Routes.SIGN_IN]: undefined;
  [Routes.NOTES]: undefined;
  [Routes.EDIT_NOTE]: {
    item: Note;
    index?: number;
    isNewNote?: boolean;
  };
};

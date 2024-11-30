import { Habit } from "modules/habits/types";
import { Note } from "modules/notes/types";

export enum Routes {
  SIGN_IN = "sign_in",
  NOTES = "notes",
  EDIT_NOTE = "edit_note",
  SEARCH = "search",
  MAIN = "main",
  CALENDAR = "calendar",
  HABITS = "habits",
  EDIT_HABIT = "edit_habit",
  HABIT_STATS = "habit_stats",
}

export type RootStackParamList = {
  [Routes.SIGN_IN]: undefined;
  [Routes.NOTES]: undefined;
  [Routes.EDIT_NOTE]: {
    item: Note;
    index?: number;
    date?: number;
    isNewNote?: boolean;
  };
  [Routes.SEARCH]: undefined;
  [Routes.CALENDAR]: undefined;
  [Routes.HABITS]: undefined;
  [Routes.EDIT_HABIT]: {
    item: Habit;
    isNewHabit?: boolean;
  };
  [Routes.HABIT_STATS]: {
    id: string;
  };
  [Routes.MAIN]: undefined;
};

export enum TabBarRouteNumber {
  notes = 0,
  calendar = 1,
  habits = 2,
}

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
  HABITS_BULK_EDIT = "habits_bulk_edit",
  ARCHIVED_HABITS = "archived_habits",
  EDIT_HABIT = "edit_habit",
  HABIT_STATS = "habit_stats",
  TASKS = "tasks",
}

export type RootStackParamList = {
  [Routes.SIGN_IN]: undefined;
  [Routes.NOTES]: undefined;
  [Routes.EDIT_NOTE]: {
    item: Note;
    date?: number;
    isNewNote?: boolean;
  };
  [Routes.SEARCH]: undefined;
  [Routes.CALENDAR]: undefined;
  [Routes.HABITS]: undefined;
  [Routes.HABITS_BULK_EDIT]: undefined;
  [Routes.ARCHIVED_HABITS]: undefined;
  [Routes.EDIT_HABIT]: {
    item: Habit;
    isNewHabit?: boolean;
  };
  [Routes.TASKS]: undefined;
  [Routes.HABIT_STATS]: {
    id: string;
  };
  [Routes.MAIN]: {
    screen: Routes.NOTES | Routes.CALENDAR | Routes.TASKS | Routes.HABITS;
  };
};

export enum TabBarRouteNumber {
  notes = 0,
  // calendar = 1,
  tasks = 1,
  habits = 2,
}

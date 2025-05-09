import theme from "theme";

import { Note } from "../types";

export const NOTE_DATE_FORMAT = "EEEE, dd MMMM yyyy";
export const NOTE_DATE_TIME_FORMAT = "EEEE, dd MMM yyyy HH:mm";
export const NOTE_TIME_FORMAT = "HH:mm";

export const EMPTY_NOTE: Note = {
  _id: "",
  author: "",
  title: "",
  content: "",
  color: theme.colors.cyan600,
  startDate: new Date().getTime(),
  rating: 1,
  isLocked: false,
  isStarred: false,
  images: [],
  type: null,
  category: [],
};

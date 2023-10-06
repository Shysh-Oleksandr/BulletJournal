import theme from "theme";

import { Note } from "../types";

export const EMPTY_NOTE: Note = {
  _id: "",
  author: "62b82f38a02731ee158d8ceb",
  title: "",
  content: "",
  color: theme.colors.cyan600,
  startDate: new Date().getTime(),
  endDate: new Date().getTime(),
  rating: 1,
  isLocked: false,
  isStarred: false,
  image: "",
  type: null,
  category: [],
};

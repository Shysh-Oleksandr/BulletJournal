import theme from "theme";

import { Note } from "../types";

export const EMPTY_NOTE: Note = {
  _id: "",
  author: "",
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

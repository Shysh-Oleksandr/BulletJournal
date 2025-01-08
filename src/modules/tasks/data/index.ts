import theme from "theme";

import { TaskItem, TaskTypes } from "../types";

export const EMPTY_TASK: TaskItem = {
  _id: "",
  author: "",
  name: "",
  color: theme.colors.cyan600,
  type: TaskTypes.CHECK,
};

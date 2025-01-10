import {
  addDays,
  addWeeks,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
} from "date-fns";
import theme from "theme";

import { TaskCategoryPeriod, TaskItem, TaskTypes } from "../types";

export const EMPTY_TASK: TaskItem = {
  _id: "",
  author: "",
  name: "",
  color: theme.colors.cyan600,
  type: TaskTypes.CHECK,
};

const START_OF_TODAY = startOfToday().getTime();
const END_OF_TODAY = endOfToday().getTime();

export const PERIODS_DATA: TaskCategoryPeriod[] = [
  {
    name: "overdue",
    start: 0,
    end: START_OF_TODAY,
    color: theme.colors.red600,
  },
  {
    name: "today",
    start: START_OF_TODAY,
    end: END_OF_TODAY,
  },
  {
    name: "tomorrow",
    start: addDays(START_OF_TODAY, 1).getTime(),
    end: addDays(END_OF_TODAY, 1).getTime(),
  },
  {
    name: "this_week",
    start: startOfWeek(START_OF_TODAY, { weekStartsOn: 1 }).getTime(),
    end: endOfWeek(END_OF_TODAY, { weekStartsOn: 1 }).getTime(),
  },
  {
    name: "next_week",
    start: addWeeks(
      startOfWeek(START_OF_TODAY, { weekStartsOn: 1 }),
      1,
    ).getTime(),
    end: addWeeks(endOfWeek(END_OF_TODAY, { weekStartsOn: 1 }), 1).getTime(),
  },
  {
    name: "this_month",
    start: startOfMonth(START_OF_TODAY).getTime(),
    end: endOfMonth(END_OF_TODAY).getTime(),
  },
  {
    name: "this_year",
    start: startOfYear(START_OF_TODAY).getTime(),
    end: endOfYear(END_OF_TODAY).getTime(),
  },
];

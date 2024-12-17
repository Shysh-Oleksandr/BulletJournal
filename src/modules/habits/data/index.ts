import theme from "theme";

import { Habit, HabitPeriods, HabitTypes } from "../types";
import { getWeekDatesByDate } from "../utils/getWeekDatesByDate";

const FIXED_DATE = new Date("2024-01-01").getTime();

export const WEEKDAYS_DATES = getWeekDatesByDate(FIXED_DATE);

export const EMPTY_HABIT: Habit = {
  _id: "",
  author: "",
  label: "",
  color: theme.colors.cyan600,
  habitType: HabitTypes.CHECK,
  streakTarget: 30,
  overallTarget: 100,
  frequency: {
    days: 7,
    period: HabitPeriods.WEEK,
  },
  logs: [],
};

export const EXTREME_PAST_DATE = new Date("2024-01-01");

import { format } from "date-fns";

import { SIMPLE_DATE_FORMAT } from "modules/calendar/data";

import { HabitLog } from "../types";

export const getMarkedHabitLogsDates = (logs: HabitLog[]) => {
  return logs.reduce(
    (acc, item) => {
      const formattedDate = format(item.date, SIMPLE_DATE_FORMAT);

      acc[formattedDate] = {
        amount: item.amount,
        percentageCompleted: item.percentageCompleted,
        marked: true,
      };

      return acc;
    },
    {} as {
      [key: string]: {
        amount: number | undefined;
        percentageCompleted: number;
        marked: boolean;
      };
    },
  );
};

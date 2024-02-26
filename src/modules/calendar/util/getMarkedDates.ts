import { format } from "date-fns";
import theme from "theme";

import { Note } from "modules/notes/types";

import { SIMPLE_DATE_FORMAT } from "../data";

export const getMarkedDates = (notes: Note[]) => {
  return notes.reduce(
    (acc, item) => {
      const formattedDate = format(item.startDate, SIMPLE_DATE_FORMAT);

      acc[formattedDate] = {
        marked: true,
        dotColor: theme.colors.cyan600,
      };

      return acc;
    },
    {} as { [key: string]: { marked: true; dotColor: string } },
  );
};

import { format } from "date-fns";

import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";

import { NOTE_DATE_TIME_FORMAT, NOTE_TIME_FORMAT } from "../data";

export const getFormattedDate = (date?: number | string | Date): string => {
  const relevantDate = date ? new Date(date) : new Date();

  return format(new Date(relevantDate), NOTE_DATE_TIME_FORMAT, {
    locale: getDateFnsLocale(),
  });
};

export const getTimeByDate = (date?: number | string | Date): string => {
  const relevantDate = date ? new Date(date) : new Date();

  return format(new Date(relevantDate), NOTE_TIME_FORMAT);
};

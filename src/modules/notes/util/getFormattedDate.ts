export const getFormattedDate = (date?: number | string | Date) =>
  date ? new Date(date).toDateString() : new Date().toDateString();

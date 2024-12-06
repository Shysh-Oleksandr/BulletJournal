import { addWeeks, format, isSameMonth, startOfYear } from "date-fns";

import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";

export function generateWeekLabels(year: number): string[] {
  const labels: string[] = [];
  let currentDate = startOfYear(new Date(year, 0, 1)); // Start of the year
  let currentMonth = format(currentDate, "LLL", { locale: getDateFnsLocale() }); // Current month name

  while (labels.length < 52) {
    // If a new month starts and there is room for more labels, add the month name
    if (
      !isSameMonth(currentDate, addWeeks(currentDate, -1)) &&
      labels.length < 52
    ) {
      labels.push(currentMonth);
    } else if (labels.length < 52) {
      // Add the week number, skipping the first week after the month name
      const weekNumber = format(currentDate, "d");

      labels.push(weekNumber);
    }

    // Move to the next week
    currentDate = addWeeks(currentDate, 1);
    currentMonth = format(currentDate, "LLL", { locale: getDateFnsLocale() });
  }

  return labels.slice(0, 52); // Ensure the array length is exactly 52
}

import { addWeeks, format, startOfYear } from "date-fns";

import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";

export function generateWeekLabels(year: number): string[] {
  const labels: string[] = [];
  const locale = getDateFnsLocale();

  // Pre-generate all weeks of the year
  const weeks = Array.from({ length: 52 }, (_, i) =>
    addWeeks(startOfYear(new Date(year, 0, 1)), i),
  );

  let lastMonth = ""; // To track month changes

  weeks.forEach((weekDate) => {
    const currentMonth = format(weekDate, "LLL", { locale });

    if (currentMonth !== lastMonth) {
      // Add month label when it changes
      labels.push(currentMonth);
      lastMonth = currentMonth;
    } else {
      // Add week number as a fallback
      labels.push(format(weekDate, "d", { locale }));
    }
  });

  return labels;
}

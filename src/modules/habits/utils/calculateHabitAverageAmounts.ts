import getWeek from "date-fns/getWeek";

import { HabitLog } from "../types";

const WEEKS_IN_YEAR = 52;

export function calculateHabitAverageAmounts(
  logs: HabitLog[],
  year: number,
): number[] {
  const totals = Array(WEEKS_IN_YEAR).fill(0);
  const counts = Array(WEEKS_IN_YEAR).fill(0);

  logs.forEach((log) => {
    const logDate = new Date(log.date);

    if (logDate.getUTCFullYear() !== year || !log.amount || log.amount <= 0) {
      return;
    }

    const week = getWeek(logDate, { weekStartsOn: 1 });

    if (week >= 1 && week <= WEEKS_IN_YEAR) {
      totals[week - 1] += log.amount;
      counts[week - 1] += 1;
    }
  });

  return totals.map((total, index) =>
    counts[index] > 0 ? total / counts[index] : 0,
  );
}

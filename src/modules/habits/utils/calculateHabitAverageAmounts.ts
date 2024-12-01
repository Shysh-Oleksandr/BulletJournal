import getWeek from "date-fns/getWeek";

import { HabitLog } from "../types";

const WEEKS_IN_YEAR = 52;

export function calculateHabitAverageAmounts(
  logs: HabitLog[],
  year: number,
): number[] {
  return Array.from({ length: WEEKS_IN_YEAR }, (_, index) => {
    const weekLogs = logs.filter(
      (log) =>
        new Date(log.date).getUTCFullYear() === year &&
        getWeek(new Date(log.date), { weekStartsOn: 1 }) === index + 1 &&
        log.amount &&
        log.amount > 0,
    );
    const totalAmount = weekLogs.reduce(
      (acc, log) => acc + (log?.amount ?? 0),
      0,
    );

    const averageAmount =
      weekLogs.length > 0 ? totalAmount / weekLogs.length : 0;

    return averageAmount;
  });
}

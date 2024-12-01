import { HabitLog } from "../types";

const MONTHS_IN_YEAR = 12;

export function calculateHabitMonthlyAmountsPerYear(
  logs: HabitLog[],
  year: number,
): number[] {
  return Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
    const monthLogs = logs.filter(
      (log) =>
        new Date(log.date).getUTCFullYear() === year &&
        new Date(log.date).getUTCMonth() === index,
    );
    const totalAmount = monthLogs.reduce(
      (acc, log) => acc + (log?.percentageCompleted >= 100 ? 1 : 0),
      0,
    );
    // TODO: use it for percentage calculation in future
    // const averageAmount =
    //   monthLogs.length > 0 ? totalAmount / monthLogs.length : 0;

    return Math.round(totalAmount);
  });
}

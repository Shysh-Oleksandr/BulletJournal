import { HabitLog } from "../types";

export function calculateAverageAmountsPerMonth(logs: HabitLog[]): number[] {
  const averageAmountsPerMonth: number[] = Array.from(
    { length: 12 },
    (_, index) => {
      const monthLogs = logs.filter(
        (log) => new Date(log.date).getUTCMonth() === index,
      );
      const totalAmount = monthLogs.reduce(
        (acc, log) => acc + (log?.amount ?? 0),
        0,
      );
      const averageAmount =
        monthLogs.length > 0 ? totalAmount / monthLogs.length : 0;

      return Math.round(averageAmount);
    },
  );

  return averageAmountsPerMonth;
}

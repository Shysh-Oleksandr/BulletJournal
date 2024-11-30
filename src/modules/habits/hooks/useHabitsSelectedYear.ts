import { useMemo, useState } from "react";

import { HabitLog } from "../types";

const currentYear = new Date().getUTCFullYear();

export const useHabitsSelectedYear = (habitLogs: HabitLog[]) => {
  const oldestHabitLogYear = useMemo(() => {
    const logs = habitLogs.filter((log) => log.amount && log.amount > 0);

    if (logs.length === 0) return currentYear;

    const oldestHabitLog = logs.reduce((prev, next) => {
      if (prev.date < next.date) return prev;

      return next;
    });

    return new Date(oldestHabitLog.date).getUTCFullYear();
  }, [habitLogs]);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const isNextYearDisabled = selectedYear === currentYear;
  const isPrevYearDisabled = selectedYear === oldestHabitLogYear;

  const onPrevArrowPress = () => setSelectedYear((prev) => prev - 1);
  const onNextArrowPress = () => setSelectedYear((prev) => prev + 1);

  return useMemo(
    () => ({
      selectedYear,
      isNextYearDisabled,
      isPrevYearDisabled,
      onPrevArrowPress,
      onNextArrowPress,
    }),
    [isNextYearDisabled, isPrevYearDisabled, selectedYear],
  );
};

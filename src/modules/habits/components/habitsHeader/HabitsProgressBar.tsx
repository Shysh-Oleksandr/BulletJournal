import { isSameDay } from "date-fns";
import React, { useMemo } from "react";
import theme from "theme";

import ProgressBar from "components/ProgressBar";
import { Habit } from "modules/habits/types";

type Props = {
  mandatoryHabits: Habit[];
  selectedDate: number;
};

const HabitsProgressBar = ({
  mandatoryHabits,
  selectedDate,
}: Props): JSX.Element => {
  const percentageCompleted = useMemo(() => {
    const completedLogs = mandatoryHabits.filter((habit) =>
      habit.logs.some(
        (log) =>
          log.percentageCompleted >= 100 && isSameDay(log.date, selectedDate),
      ),
    ).length;

    const percentageCompleted = (completedLogs / mandatoryHabits.length) * 100;

    return Math.min(percentageCompleted, 100);
  }, [mandatoryHabits, selectedDate]);

  return (
    <ProgressBar
      bgColor={theme.colors.cyan700}
      percentageCompleted={percentageCompleted}
    />
  );
};

export default React.memo(HabitsProgressBar);

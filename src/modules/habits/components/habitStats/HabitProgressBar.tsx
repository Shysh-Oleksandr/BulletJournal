import React, { useMemo } from "react";

import ProgressBar from "components/ProgressBar";
import { Habit } from "modules/habits/types";

type Props = {
  habit: Habit;
};

const HabitProgressBar = ({ habit }: Props): JSX.Element => {
  const percentageCompleted = useMemo(() => {
    const completedLogs = habit.logs.filter(
      (log) => log.percentageCompleted >= 100,
    ).length;

    const percentageCompleted = (completedLogs / habit.overallTarget) * 100;

    return Math.min(percentageCompleted, 100);
  }, [habit.logs, habit.overallTarget]);

  return (
    <ProgressBar
      bgColor={habit.color}
      percentageCompleted={percentageCompleted}
    />
  );
};

export default React.memo(HabitProgressBar);

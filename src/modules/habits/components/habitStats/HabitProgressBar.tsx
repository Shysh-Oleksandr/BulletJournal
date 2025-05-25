import React, { useMemo } from "react";

import ProgressBar from "components/ProgressBar";
import { Habit } from "modules/habits/types";

type Props = {
  habit: Habit;
};

const HabitProgressBar = ({ habit }: Props): JSX.Element => {
  const percentageCompleted = useMemo(() => {
    const percentageCompleted =
      (habit.cachedMetrics.overallCompletions / habit.overallTarget) * 100;

    return Math.min(percentageCompleted, 100);
  }, [habit.cachedMetrics.overallCompletions, habit.overallTarget]);

  return (
    <ProgressBar
      bgColor={habit.color}
      percentageCompleted={percentageCompleted}
    />
  );
};

export default React.memo(HabitProgressBar);

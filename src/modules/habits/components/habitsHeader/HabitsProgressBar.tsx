import React, { useMemo } from "react";
import theme from "theme";

import ProgressBar from "components/ProgressBar";
import { Habit } from "modules/habits/types";
import { calculateHabitsPercentageCompletedByDay } from "modules/habits/utils/calculateHabitsPercentageCompletedByDay";

type Props = {
  mandatoryHabits: Habit[];
  selectedDate: number;
};

const HabitsProgressBar = ({
  mandatoryHabits,
  selectedDate,
}: Props): JSX.Element => {
  const percentageCompleted = useMemo(
    () =>
      calculateHabitsPercentageCompletedByDay(mandatoryHabits, selectedDate),
    [mandatoryHabits, selectedDate],
  );

  return (
    <ProgressBar
      bgColor={theme.colors.cyan700}
      percentageCompleted={percentageCompleted}
    />
  );
};

export default React.memo(HabitsProgressBar);

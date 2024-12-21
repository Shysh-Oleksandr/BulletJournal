import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import theme from "theme";

import { Habit } from "modules/habits/types";
import styled from "styled-components/native";
import { getDifferentColor, isLightColor } from "utils/getDifferentColor";

type Props = {
  habit: Habit;
};

const HabitProgressBar = ({ habit }: Props): JSX.Element => {
  const secondaryBgColor = useMemo(
    () =>
      isLightColor(habit.color)
        ? getDifferentColor(habit.color, 20)
        : getDifferentColor(habit.color, 35),
    [habit.color],
  );

  const percentageCompleted = useMemo(() => {
    const completedLogs = habit.logs.filter(
      (log) => log.percentageCompleted >= 100,
    ).length;

    const percentageCompleted = (completedLogs / habit.overallTarget) * 100;

    return Math.min(percentageCompleted, 100);
  }, [habit.logs, habit.overallTarget]);

  return (
    <ProgressBarContainer>
      <ProgressBar
        start={[0, 1]}
        end={[1, 0]}
        colors={[secondaryBgColor, habit.color]}
        percentageCompleted={percentageCompleted}
      />
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 6px;
  background-color: ${theme.colors.cyan300};
`;

const ProgressBar = styled(LinearGradient)<{ percentageCompleted: number }>`
  width: ${({ percentageCompleted }) => `${percentageCompleted}%`};
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`;

export default React.memo(HabitProgressBar);

import { isBefore, isSameDay } from "date-fns";
import React, { useMemo } from "react";

import { useUpdateHabitLog } from "../../hooks/useUpdateHabitLog";
import { Habit } from "../../types";

import HabitBody from "./HabitBody";

type Props = {
  habit: Habit;
  selectedDate: number;
  onLongPress?: () => void;
};

const HabitItem = ({
  habit,
  selectedDate,
  onLongPress,
}: Props): JSX.Element => {
  const { inputValue, currentLog, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate,
  });

  const isActiveOnSelectedDate = useMemo(
    () =>
      Boolean(
        habit.oldestLogDate && !isBefore(selectedDate, habit.oldestLogDate),
      ),
    [habit.oldestLogDate, selectedDate],
  );

  const isCompleted = useMemo(
    () =>
      habit.logs.some(
        (log) =>
          log.percentageCompleted >= 100 && isSameDay(log.date, selectedDate),
      ),
    [habit.logs, selectedDate],
  );

  return (
    <HabitBody
      habit={habit}
      inputValue={inputValue}
      isCompleted={isCompleted}
      amountTarget={currentLog?.amountTarget}
      percentageCompleted={currentLog?.percentageCompleted}
      isActiveOnSelectedDate={isActiveOnSelectedDate}
      onChange={onChange}
      updateLog={updateLog}
      onLongPress={onLongPress}
    />
  );
};

export default React.memo(HabitItem);

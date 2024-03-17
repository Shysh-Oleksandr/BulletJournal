import { isSameDay } from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";

import { useUpdateHabitLog } from "../hooks/useUpdateHabitLog";
import { Habit } from "../types";

import HabitBody from "./HabitBody";

type Props = {
  habit: Habit;
  selectedDate: number;
  isFirstOptionalHabitId?: boolean;
};

const HabitItem = ({
  habit,
  selectedDate,
  isFirstOptionalHabitId,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { inputValue, currentLog, onChange, updateLog } = useUpdateHabitLog({
    habit,
    selectedDate,
  });

  const isTodaySelected = useMemo(
    () => isSameDay(selectedDate, new Date()),
    [selectedDate],
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
    <>
      {isFirstOptionalHabitId && (
        <Typography
          fontWeight="semibold"
          fontSize="lg"
          paddingTop={16}
          paddingBottom={16}
        >
          {t(
            isTodaySelected
              ? "habits.optionalHabitsToday"
              : "habits.optionalHabitsThatDay",
          )}
        </Typography>
      )}

      <HabitBody
        habit={habit}
        inputValue={inputValue}
        isCompleted={isCompleted}
        amountTarget={currentLog?.amountTarget}
        percentageCompleted={currentLog?.percentageCompleted}
        onChange={onChange}
        updateLog={updateLog}
      />
    </>
  );
};

export default React.memo(HabitItem);

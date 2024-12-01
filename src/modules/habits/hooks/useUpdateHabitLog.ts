import { isSameDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { habitsApi } from "../HabitsApi";
import { Habit, HabitLog, HabitTypes } from "../types";

type Props = {
  habit: Habit;
  selectedDate: number;
};

export const useUpdateHabitLog = ({ habit, selectedDate }: Props) => {
  const [updateHabit] = habitsApi.useUpdateHabitMutation();

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const currentLog = useMemo(
    () => habit.logs.find((log) => isSameDay(log.date, selectedDate)),
    [habit.logs, selectedDate],
  );

  const initialLogValue = currentLog?.amount?.toString() ?? "0";

  const [inputValue, setInputValue] = useState(initialLogValue);

  const updateLog = useCallback(() => {
    if (inputValue.trim().length === 0) {
      setInputValue(initialLogValue);

      return;
    }

    const value = +inputValue.replace(",", ".");

    if (isNaN(value)) {
      setInputValue(initialLogValue);

      return;
    }

    const isSameValue = !isCheckHabitType && value === currentLog?.amount;

    if (isSameValue) return;

    const amountPercentageCompleted = habit.amountTarget
      ? Math.round((value / habit.amountTarget) * 100)
      : 0;

    const updatedLogs: HabitLog[] = currentLog
      ? habit.logs.map((log) => {
          if (!isSameDay(log.date, selectedDate)) return log;

          const checkedPercentageCompleted =
            log.percentageCompleted === 100 ? 0 : 100;

          const percentageCompleted = isCheckHabitType
            ? checkedPercentageCompleted
            : amountPercentageCompleted;

          return {
            date: selectedDate,
            percentageCompleted,
            amount: isCheckHabitType ? checkedPercentageCompleted / 100 : value,
            amountTarget: habit.amountTarget ?? 1,
          } as HabitLog;
        })
      : [
          ...habit.logs,
          {
            date: selectedDate,
            percentageCompleted: isCheckHabitType
              ? 100
              : amountPercentageCompleted,
            amount: isCheckHabitType ? 1 : value,
            amountTarget: habit.amountTarget ?? 1,
          },
        ];

    updateHabit({ logs: updatedLogs, _id: habit._id, author: habit.author });
  }, [
    inputValue,
    isCheckHabitType,
    currentLog,
    habit.amountTarget,
    habit.logs,
    habit._id,
    habit.author,
    selectedDate,
    updateHabit,
    initialLogValue,
  ]);

  const onChange = useCallback((text: string) => {
    const newValue = Number(text);

    if (newValue < 0) {
      setInputValue("0");

      return;
    }

    setInputValue(text);
  }, []);

  useEffect(() => {
    setInputValue(initialLogValue);
  }, [initialLogValue]);

  return useMemo(
    () => ({ inputValue, updateLog, onChange, currentLog }),
    [currentLog, inputValue, onChange, updateLog],
  );
};

import { isSameDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppDispatch } from "store/helpers/storeHooks";

import { habitsApi } from "../HabitsApi";
import { updateHabitLog } from "../HabitsSlice";
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

  const dispatch = useAppDispatch();

  const updateLog = useCallback(() => {
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
            amountTarget: habit.amountTarget,
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
            amountTarget: habit.amountTarget ?? undefined,
          },
        ];

    dispatch(updateHabitLog({ habitId: habit._id, updatedLogs }));

    updateHabit({ ...habit, logs: updatedLogs });
  }, [
    inputValue,
    isCheckHabitType,
    currentLog,
    habit,
    selectedDate,
    dispatch,
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

  return { inputValue, updateLog, onChange, currentLog };
};

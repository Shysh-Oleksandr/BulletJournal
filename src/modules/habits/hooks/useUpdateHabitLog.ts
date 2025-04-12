import { isSameDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import { habitsApi } from "../api/habitsApi";
import { Habit, HabitTypes } from "../types";

type Props = {
  habit: Habit;
  selectedDate: number;
};

export const useUpdateHabitLog = ({ habit, selectedDate }: Props) => {
  const { mutate: updateHabitLog } = habitsApi.useUpdateHabitLogMutation();
  const { mutate: createHabitLog } = habitsApi.useCreateHabitLogMutation();

  const isCheckHabitType = habit.habitType === HabitTypes.CHECK;

  const currentLog = useMemo(
    () =>
      habit.logs.find(
        (log) => !log.isArtificial && isSameDay(log.date, selectedDate),
      ),
    [habit.logs, selectedDate],
  );

  const initialLogValue = currentLog?.amount?.toString() ?? "0";

  const [inputValue, setInputValue] = useState(initialLogValue);

  const updateLog = useCallback(() => {
    if (currentLog?._id.includes("temp")) return;

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

    if (currentLog?._id) {
      const checkedPercentageCompleted =
        currentLog.percentageCompleted === 100 ? 0 : 100;

      const percentageCompleted = isCheckHabitType
        ? checkedPercentageCompleted
        : amountPercentageCompleted;

      updateHabitLog({
        ...currentLog,
        date: selectedDate,
        percentageCompleted,
        amount: isCheckHabitType ? checkedPercentageCompleted / 100 : value,
        amountTarget: habit.amountTarget ?? 1,
        isArtificial: false,
      });
    } else {
      createHabitLog({
        date: selectedDate,
        percentageCompleted: isCheckHabitType ? 100 : amountPercentageCompleted,
        amount: isCheckHabitType ? 1 : value,
        amountTarget: habit.amountTarget ?? 1,
        habitId: habit._id,
      });
    }
  }, [
    inputValue,
    isCheckHabitType,
    currentLog,
    habit.amountTarget,
    habit._id,
    initialLogValue,
    updateHabitLog,
    selectedDate,
    createHabitLog,
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

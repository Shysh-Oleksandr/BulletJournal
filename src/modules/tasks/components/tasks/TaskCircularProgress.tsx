import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import ItemCircularProgress from "components/ItemCircularProgress";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { tasksApi } from "modules/tasks/api/tasksApi";

import { TaskItem, TaskTypes } from "../../types";

const CIRCLE_SIZE = 36;
const CIRCLE_WIDTH = 4;

type Props = {
  task: TaskItem;
  currentType?: TaskTypes;
  currentTarget?: number;
  currentCompletedAmount?: number;
  setCurrentCompletedAmount?: (val: number) => void;
  setCurrentCompletedAt?: (val: number | null) => void;
};

const TaskCircularProgress = ({
  task,
  currentType,
  currentTarget,
  currentCompletedAmount,
  setCurrentCompletedAmount,
  setCurrentCompletedAt,
}: Props): JSX.Element => {
  const userId = useAuthStore((state) => state.userId);

  const inputRef = useRef<TextInput | null>(null);

  const { mutate: updateTask } = tasksApi.useUpdateTaskMutation();

  const shouldUpdateLocally = currentCompletedAmount !== undefined;

  const isCheckType = (currentType ?? task.type) === TaskTypes.CHECK;
  const relevantCompletedAmount = shouldUpdateLocally
    ? currentCompletedAmount
    : task.completedAmount;
  const relevantTarget = shouldUpdateLocally ? currentTarget : task.target;
  const relevantIsCompleted = shouldUpdateLocally
    ? !!currentCompletedAmount
    : !!task.isCompleted;
  const initialLogValue = relevantCompletedAmount?.toString() ?? "0";

  const [inputValue, setInputValue] = useState(initialLogValue);

  const percentageCompleted = useMemo(() => {
    if (isCheckType) return relevantIsCompleted ? 100 : 0;

    if (relevantCompletedAmount && relevantTarget)
      return Math.min((relevantCompletedAmount / relevantTarget) * 100, 100);

    return 0;
  }, [
    isCheckType,
    relevantCompletedAmount,
    relevantIsCompleted,
    relevantTarget,
  ]);

  const onChange = useCallback(
    (text: string) => {
      const newValue = Number(text);

      if (newValue < 0) {
        setInputValue("0");

        return;
      }

      setInputValue(text);

      if (shouldUpdateLocally) {
        const value = +text.replace(",", ".");

        !isNaN(value) && setCurrentCompletedAmount?.(value);
      }
    },
    [setCurrentCompletedAmount, shouldUpdateLocally],
  );

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

    const isSameValue = value === relevantCompletedAmount;

    if (isSameValue) return;

    const isCompleted = value >= task.target!;
    const completedAt = isCompleted ? (task.completedAt ?? Date.now()) : null;

    if (shouldUpdateLocally) {
      setCurrentCompletedAmount?.(value);
      setCurrentCompletedAt?.(completedAt);

      return;
    }

    updateTask({
      _id: task._id,
      author: userId,
      isCompleted,
      completedAmount: value,
      completedAt,
    });
  }, [
    inputValue,
    relevantCompletedAmount,
    task.target,
    task.completedAt,
    task._id,
    shouldUpdateLocally,
    updateTask,
    userId,
    initialLogValue,
    setCurrentCompletedAmount,
    setCurrentCompletedAt,
  ]);

  const onCirclePress = useCallback(() => {
    if (isCheckType) {
      if (shouldUpdateLocally) {
        setCurrentCompletedAmount?.(relevantIsCompleted ? 0 : 1);
        setCurrentCompletedAt?.(
          relevantIsCompleted ? null : (task.completedAt ?? Date.now()),
        );

        return;
      }

      const isCompleted = !task.isCompleted;

      updateTask({
        _id: task._id,
        author: userId,
        isCompleted,
        completedAmount: isCompleted ? 1 : 0,
        completedAt: isCompleted ? Date.now() : null,
      });

      return;
    }

    inputRef.current?.focus();
  }, [
    isCheckType,
    relevantIsCompleted,
    setCurrentCompletedAmount,
    setCurrentCompletedAt,
    shouldUpdateLocally,
    task._id,
    task.completedAt,
    task.isCompleted,
    updateTask,
    userId,
  ]);

  useEffect(() => {
    setInputValue(initialLogValue);
  }, [initialLogValue]);

  return (
    <TouchableOpacity onPress={onCirclePress} hitSlop={BUTTON_HIT_SLOP}>
      <ItemCircularProgress
        inputValue={inputValue}
        color={task.color}
        isCheckType={isCheckType}
        isCompleted={
          isCheckType ? relevantIsCompleted : percentageCompleted >= 100
        }
        percentageCompleted={percentageCompleted}
        handleUpdate={updateLog}
        onChange={onChange}
        circleSize={CIRCLE_SIZE}
        circleWidth={CIRCLE_WIDTH}
        inputRef={inputRef}
      />
    </TouchableOpacity>
  );
};

export default React.memo(TaskCircularProgress);

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
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../../TasksApi";
import { TaskItem, TaskTypes } from "../../types";

const CIRCLE_SIZE = 36;
const CIRCLE_WIDTH = 4;

type Props = {
  task: TaskItem;
  currentType?: TaskTypes;
  currentTarget?: number;
  currentCompletedAmount?: number;
  setCurrentCompletedAmount?: (val: number) => void;
};

const TaskCircularProgress = ({
  task,
  currentType,
  currentTarget,
  currentCompletedAmount,
  setCurrentCompletedAmount,
}: Props): JSX.Element => {
  const userId = useAppSelector(getUserId);

  const inputRef = useRef<TextInput | null>(null);

  const [updateTask] = tasksApi.useUpdateTaskMutation();

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

    if (shouldUpdateLocally) {
      setCurrentCompletedAmount?.(value);

      return;
    }

    updateTask({
      _id: task._id,
      author: userId,
      isCompleted: value >= task.target!,
      completedAmount: value,
    });
  }, [
    inputValue,
    relevantCompletedAmount,
    shouldUpdateLocally,
    updateTask,
    task._id,
    task.target,
    userId,
    initialLogValue,
    setCurrentCompletedAmount,
  ]);

  const onCirclePress = useCallback(() => {
    if (isCheckType) {
      if (shouldUpdateLocally) {
        setCurrentCompletedAmount?.(relevantIsCompleted ? 0 : 1);

        return;
      }

      updateTask({
        _id: task._id,
        author: userId,
        isCompleted: !task.isCompleted,
        completedAmount: task.isCompleted ? 0 : 1,
      });

      return;
    }

    inputRef.current?.focus();
  }, [
    isCheckType,
    relevantIsCompleted,
    setCurrentCompletedAmount,
    shouldUpdateLocally,
    task._id,
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

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import ItemCircularProgress from "components/ItemCircularProgress";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../../TasksApi";
import { TaskItem, TaskTypes } from "../../types";

const CIRCLE_SIZE = 36;
const CIRCLE_WIDTH = 4;

type Props = {
  task: TaskItem;
};

const TaskCircularProgress = ({ task }: Props): JSX.Element => {
  const userId = useAppSelector(getUserId);

  const inputRef = useRef<TextInput | null>(null);

  const [updateTask] = tasksApi.useUpdateTaskMutation();

  const isCheckType = task.type === TaskTypes.CHECK;
  const initialLogValue = task.completedAmount?.toString() ?? "0";

  const [inputValue, setInputValue] = useState(initialLogValue);

  const percentageCompleted = useMemo(() => {
    if (isCheckType) return task.isCompleted ? 100 : 0;

    if (task.completedAmount && task.target)
      return Math.min((task.completedAmount / task.target) * 100, 100);

    return 0;
  }, [isCheckType, task.completedAmount, task.isCompleted, task.target]);

  const onChange = useCallback((text: string) => {
    const newValue = Number(text);

    if (newValue < 0) {
      setInputValue("0");

      return;
    }

    setInputValue(text);
  }, []);

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

    const isSameValue = value === task.completedAmount;

    if (isSameValue) return;

    updateTask({
      _id: task._id,
      author: userId,
      isCompleted: value >= task.target!,
      completedAmount: value,
    });
  }, [
    inputValue,
    task.completedAmount,
    task._id,
    task.target,
    updateTask,
    userId,
    initialLogValue,
  ]);

  const onCirclePress = useCallback(() => {
    if (isCheckType) {
      updateTask({
        _id: task._id,
        author: userId,
        isCompleted: !task.isCompleted,
      });

      return;
    }

    inputRef.current?.focus();
  }, [isCheckType, task._id, task.isCompleted, updateTask, userId]);

  useEffect(() => {
    setInputValue(initialLogValue);
  }, [initialLogValue]);

  return (
    <TouchableOpacity onPress={onCirclePress}>
      <ItemCircularProgress
        inputValue={inputValue}
        color={task.color}
        isCheckType={isCheckType}
        isCompleted={
          isCheckType ? !!task.isCompleted : percentageCompleted >= 100
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

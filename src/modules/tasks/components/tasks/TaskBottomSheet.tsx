import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import theme from "theme";

import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";

import { tasksApi } from "../../TasksApi";
import { TaskItem, TaskTypes } from "../../types";
import DueDatePicker from "../common/DueDatePicker";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import TaskItemInput from "../common/TaskItemInput";

import TaskTypeSelector from "./TaskTypeSelector";

type Props = {
  groupId?: string;
  parentTaskId?: string;
  task?: TaskItem;
  content?: JSX.Element;
  depth?: number;
  children: (openModal: () => void) => JSX.Element;
};

const TaskBottomSheet = ({
  groupId,
  parentTaskId,
  task,
  content,
  depth = 0,
  children,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [createTask] = tasksApi.useCreateTaskMutation();
  const [updateTask] = tasksApi.useUpdateTaskMutation();
  const [deleteTask] = tasksApi.useDeleteTaskMutation();

  const userId = useAppSelector(getUserId);

  const inputRef = useRef<TextInput | null>(null);

  const defaultValues = useMemo(
    () => ({
      name: task?.name ?? "",
      color: task?.color ?? theme.colors.cyan700,
      dueDate: task?.dueDate ?? null,
      selectedType: task?.type ?? TaskTypes.CHECK,
      currentTarget: task?.target ?? 100,
      currentUnits: task?.units ?? "%",
      currentCompletedAmount: task?.completedAmount ?? 0,
    }),
    [task],
  );

  const [formValues, setFormValues] = useState(defaultValues);

  const hasChanges = useMemo(
    () => JSON.stringify(defaultValues) !== JSON.stringify(formValues),
    [defaultValues, formValues],
  );

  const handleReset = useCallback(() => {
    setFormValues(defaultValues);
  }, [defaultValues]);

  const handleUpdateTask = () => {
    const normalizedName = formValues.name.trim();

    if (normalizedName.length === 0) return;

    const isCheckType = formValues.selectedType === TaskTypes.CHECK;

    const commonFields = {
      author: userId,
      dueDate: formValues.dueDate,
      color: formValues.color,
      name: normalizedName,
      type: formValues.selectedType,
      units: isCheckType ? null : formValues.currentUnits,
      target: isCheckType ? null : formValues.currentTarget,
      completedAmount: formValues.currentCompletedAmount,
      isCompleted: isCheckType
        ? !!formValues.currentCompletedAmount
        : formValues.currentCompletedAmount >= formValues.currentTarget,
    };

    if (task) {
      if (hasChanges) {
        updateTask({
          _id: task._id,
          ...commonFields,
        });
      }
    } else {
      createTask({
        groupId,
        parentTaskId,
        ...commonFields,
      });

      handleReset();
    }
  };

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{ minHeight: task ? `${50 - 1 * depth}%` : undefined }}
      onOpen={() => {
        if (task) return;

        setTimeout(() => {
          const nameLength = formValues.name.length;

          inputRef.current?.focus();
          inputRef.current?.setSelection(nameLength, nameLength);
        }, 200);
      }}
      onClose={handleUpdateTask}
      content={(closeModal) => (
        <>
          <TaskItemInput
            inputRef={inputRef}
            name={formValues.name}
            setName={(name) => setFormValues((prev) => ({ ...prev, name }))}
            color={formValues.color}
            setColor={(color) => setFormValues((prev) => ({ ...prev, color }))}
            inputPlaceholder={t(
              parentTaskId
                ? "tasks.subtaskPlaceholder"
                : "tasks.taskPlaceholder",
            )}
            onSubmitEditing={() => {
              handleUpdateTask();
              closeModal();
            }}
            onDelete={
              task
                ? () => {
                    deleteTask(task._id);
                    closeModal();
                  }
                : undefined
            }
            onReset={hasChanges ? handleReset : undefined}
          />
          <DueDatePicker
            dueDate={formValues.dueDate}
            setDueDate={(dueDate) =>
              setFormValues((prev) => ({ ...prev, dueDate }))
            }
          />
          <TaskTypeSelector
            task={task}
            selectedType={formValues.selectedType}
            currentTarget={formValues.currentTarget}
            currentUnits={formValues.currentUnits}
            currentCompletedAmount={formValues.currentCompletedAmount}
            setSelectedType={(type) =>
              setFormValues((prev) => ({ ...prev, selectedType: type }))
            }
            setCurrentAmount={(amount) =>
              setFormValues((prev) => ({ ...prev, currentTarget: amount }))
            }
            setCurrentUnits={(units) =>
              setFormValues((prev) => ({ ...prev, currentUnits: units }))
            }
            setCurrentCompletedAmount={(completedAmount) =>
              setFormValues((prev) => ({
                ...prev,
                currentCompletedAmount: completedAmount,
              }))
            }
          />
          {content}
        </>
      )}
    >
      {(openModal) => children(openModal)}
    </ItemInfoBottomSheet>
  );
};

export default React.memo(TaskBottomSheet);

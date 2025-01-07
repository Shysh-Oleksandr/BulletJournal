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
      color: task?.color ?? theme.colors.cyan600,
      dueDate: task?.dueDate ?? null,
      selectedType: task?.type ?? TaskTypes.CHECK,
      currentAmount: task?.target ?? 100,
      currentUnits: task?.units ?? "%",
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

    if (task) {
      // TODO: show alert if invalid data
      if (hasChanges) {
        updateTask({
          _id: task._id,
          author: userId,
          dueDate: formValues.dueDate,
          color: formValues.color,
          name: normalizedName,
          type: formValues.selectedType,
          units:
            formValues.selectedType === TaskTypes.CHECK
              ? null
              : formValues.currentUnits,
          target:
            formValues.selectedType === TaskTypes.CHECK
              ? null
              : formValues.currentAmount,
        });
      }
    } else {
      createTask({
        author: userId,
        ...formValues,
        name: normalizedName,
        groupId,
        parentTaskId,
        type: formValues.selectedType,
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
            currentAmount={formValues.currentAmount}
            currentUnits={formValues.currentUnits}
            setSelectedType={(type) =>
              setFormValues((prev) => ({ ...prev, selectedType: type }))
            }
            setCurrentAmount={(amount) =>
              setFormValues((prev) => ({ ...prev, currentAmount: amount }))
            }
            setCurrentUnits={(units) =>
              setFormValues((prev) => ({ ...prev, currentUnits: units }))
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

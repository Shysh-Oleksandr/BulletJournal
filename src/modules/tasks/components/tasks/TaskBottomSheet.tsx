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

import { useAuth } from "modules/auth/AuthContext";
import { tasksApi } from "modules/tasks/api/tasksApi";
import { useTaskPath } from "modules/tasks/api/tasksSelectors";

import { TaskItem, TaskTypes } from "../../types";
import DueDatePicker from "../common/DueDatePicker";
import ItemActionsList from "../common/ItemActionsList";
import ItemInfoBottomSheet from "../common/ItemInfoBottomSheet";
import ItemPathLabel from "../common/ItemPathLabel";
import TaskDescriptionInput from "../common/TaskDescriptionInput";
import TaskItemInput from "../common/TaskItemInput";

import TaskTypeSelector from "./TaskTypeSelector";

type Props = {
  groupId?: string;
  parentTaskId?: string;
  task?: TaskItem;
  content?: (closeModal: () => void) => JSX.Element;
  defaultDueDate?: number;
  openByDefault?: boolean;
  depth?: number;
  onClose?: () => void;
  children: (openModal: () => void) => JSX.Element;
};

const TaskBottomSheet = ({
  groupId,
  parentTaskId,
  task,
  content,
  defaultDueDate,
  openByDefault,
  depth = 0,
  onClose,
  children,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { mutate: createTask } = tasksApi.useCreateTaskMutation();
  const { mutate: updateTask } = tasksApi.useUpdateTaskMutation();

  const userId = useAuth().userId;

  const inputRef = useRef<TextInput | null>(null);
  const descriptionInputRef = useRef<TextInput | null>(null);

  const defaultValues = useMemo(
    () => ({
      name: task?.name ?? "",
      color: task?.color ?? theme.colors.cyan700,
      dueDate: task?.dueDate ?? defaultDueDate ?? null,
      selectedType: task?.type ?? TaskTypes.CHECK,
      currentTarget: task?.target ?? 100,
      currentUnits: task?.units ?? "%",
      currentCompletedAmount: task?.completedAmount ?? 0,
      currentCompletedAt: task?.completedAt ?? null,
      description: task?.description ?? "",
      currentIsArchived: !!task?.isArchived,
      currentParentItems: {
        groupId: task?.groupId ?? groupId ?? null,
        parentTaskId: task?.parentTaskId ?? parentTaskId ?? null,
      },
    }),
    [task, defaultDueDate, groupId, parentTaskId],
  );

  const [formValues, setFormValues] = useState(defaultValues);
  const [showDescriptionField, setShowDescriptionField] = useState(
    !!defaultValues.description,
  );

  const taskPath = useTaskPath(
    task?._id,
    !task,
    formValues.currentParentItems.parentTaskId ??
      formValues.currentParentItems.groupId,
  );

  const hasChanges = useMemo(
    () => JSON.stringify(defaultValues) !== JSON.stringify(formValues),
    [defaultValues, formValues],
  );

  const handleReset = useCallback(() => {
    setFormValues(defaultValues);
    setShowDescriptionField(!!defaultValues.description);
  }, [defaultValues]);

  const handleUpdateTask = () => {
    onClose?.();

    const normalizedName = formValues.name.trim();

    if (normalizedName.length === 0) return;

    const isCheckType = formValues.selectedType === TaskTypes.CHECK;

    const isCompleted = isCheckType
      ? !!formValues.currentCompletedAmount
      : formValues.currentCompletedAmount >= formValues.currentTarget;
    const commonFields = {
      author: userId,
      dueDate: formValues.dueDate,
      color: formValues.color,
      name: normalizedName,
      description: formValues.description.trim(),
      type: formValues.selectedType,
      units: isCheckType ? null : formValues.currentUnits,
      target: isCheckType ? null : formValues.currentTarget,
      completedAmount: formValues.currentCompletedAmount,
      isCompleted,
      completedAt: isCompleted
        ? (formValues.currentCompletedAt ?? Date.now())
        : null,
      isArchived: formValues.currentIsArchived,
      groupId: formValues.currentParentItems.groupId,
      parentTaskId: formValues.currentParentItems.parentTaskId,
    };

    if (task) {
      if (hasChanges) {
        updateTask({
          _id: task._id,
          ...commonFields,
        });
      }
    } else {
      createTask(commonFields);

      handleReset();
    }
  };

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <ItemInfoBottomSheet
      bottomModalProps={{
        minHeight: task ? `${50 - 1 * depth}%` : undefined,
      }}
      onOpen={() => {
        if (task) return;

        setTimeout(() => {
          const nameLength = formValues.name.length;

          inputRef.current?.focus();
          inputRef.current?.setSelection(nameLength, nameLength);
        }, 200);
      }}
      onClose={handleUpdateTask}
      openByDefault={openByDefault}
      content={(closeModal) => (
        <>
          <ItemPathLabel itemPath={taskPath} color={formValues.color} />

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
            onReset={hasChanges ? handleReset : undefined}
          />

          {showDescriptionField && (
            <TaskDescriptionInput
              description={formValues.description}
              color={formValues.color}
              setDescription={(description) =>
                setFormValues((prev) => ({ ...prev, description }))
              }
              inputRef={descriptionInputRef}
              onBlur={() => {
                if (formValues.description.trim().length === 0) {
                  setShowDescriptionField(false);
                }
              }}
            />
          )}

          <DueDatePicker
            dueDate={formValues.dueDate}
            setDueDate={(dueDate) =>
              setFormValues((prev) => ({ ...prev, dueDate }))
            }
            completedAt={formValues?.currentCompletedAt}
            setCompletedAt={(completedAt) =>
              setFormValues((prev) => ({
                ...prev,
                currentCompletedAt: completedAt,
              }))
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
            setCurrentCompletedAt={(completedAt) =>
              setFormValues((prev) => ({
                ...prev,
                currentCompletedAt: completedAt,
              }))
            }
          />

          <ItemActionsList
            isTask
            canMoveOutside={Boolean(
              formValues.currentParentItems.parentTaskId ||
                formValues.currentParentItems.groupId,
            )}
            itemId={task?._id}
            onDescriptionPress={
              showDescriptionField
                ? undefined
                : () => {
                    setShowDescriptionField(true);
                    requestAnimationFrame(() => {
                      descriptionInputRef.current?.focus();
                    });
                  }
            }
            onMoveItem={(parentItems) =>
              setFormValues((prev) => ({
                ...prev,
                currentParentItems: parentItems,
              }))
            }
            currentIsArchived={formValues.currentIsArchived}
            onArchive={(isArchived) =>
              setFormValues((prev) => ({
                ...prev,
                currentIsArchived: isArchived,
              }))
            }
            closeModal={closeModal}
          />

          {content?.(closeModal)}
        </>
      )}
    >
      {(openModal) => children(openModal)}
    </ItemInfoBottomSheet>
  );
};

export default React.memo(TaskBottomSheet);

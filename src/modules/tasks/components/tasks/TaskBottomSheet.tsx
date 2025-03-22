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

import { MaterialIcons } from "@expo/vector-icons";
import { LabelSelector } from "components/LabelSelector";
import Typography from "components/Typography";
import { useAuthStore } from "modules/auth/hooks/useAuthStore";
import { useCustomLabels } from "modules/customLabels/api/customLabelsSelectors";
import { tasksApi } from "modules/tasks/api/tasksApi";
import { useTaskPath } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

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

  const userId = useAuthStore((state) => state.userId);

  const { labels } = useCustomLabels("Task");

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
      currentLabelsIds: task?.customLabels?.map((label) => label._id) ?? [],
    }),
    [task, defaultDueDate, groupId, parentTaskId],
  );

  const [formValues, setFormValues] = useState(defaultValues);
  const [showDescriptionField, setShowDescriptionField] = useState(
    !!defaultValues.description,
  );
  const [isLabelsBottomSheetVisible, setIsLabelsBottomSheetVisible] =
    useState(false);

  const currentLabels = useMemo(
    () =>
      labels.filter((label) => formValues.currentLabelsIds.includes(label._id)),
    [labels, formValues.currentLabelsIds],
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
      customLabels: currentLabels, // Sending populated labels as we use them in optimistic updates
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

          {currentLabels.length > 0 && (
            <ActiveLabelsContainer
              onPress={() => setIsLabelsBottomSheetVisible(true)}
            >
              <MaterialIcons
                name="label"
                size={theme.fontSizes.xl}
                color={formValues.color}
                style={{ marginTop: 8 }}
              />
              <LabelsContainer>
                {currentLabels.map((label) => (
                  <LabelContainer key={label._id} bgColor={label.color}>
                    <Typography
                      color={theme.colors.white}
                      fontWeight="semibold"
                      align="center"
                      fontSize="xs"
                    >
                      {label.labelName}
                    </Typography>
                  </LabelContainer>
                ))}
              </LabelsContainer>
            </ActiveLabelsContainer>
          )}

          <LabelSelector
            labels={labels}
            isVisible={isLabelsBottomSheetVisible}
            onClose={() => setIsLabelsBottomSheetVisible(false)}
            selectedIds={formValues.currentLabelsIds}
            setSelectedIds={(selectedIds) =>
              setFormValues((prev) => ({
                ...prev,
                currentLabelsIds: selectedIds,
              }))
            }
            currentColor={formValues.color}
            onSelectColor={(color) =>
              setFormValues((prev) => ({ ...prev, color }))
            }
            labelKey="tasks.chooseLabels"
            inputPlaceholderKey="tasks.enterNewLabel"
            labelFor="Task"
            createdLabelKey="tasks.labelCreated"
            existsLabelKey="tasks.labelAlreadyExists"
            labelItemProps={{
              updatedLabelKey: "tasks.labelUpdated",
              deletedLabelKey: "tasks.labelDeleted",
            }}
          />

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
            onLabelsPress={
              formValues.currentLabelsIds.length > 0
                ? undefined
                : () => setIsLabelsBottomSheetVisible(true)
            }
          />

          {content?.(closeModal)}
        </>
      )}
    >
      {(openModal) => children(openModal)}
    </ItemInfoBottomSheet>
  );
};

const ActiveLabelsContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-vertical: 2px;
`;

const LabelsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const LabelContainer = styled.View<{ bgColor: string }>`
  padding: 3px 6px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 4px;
`;

export default React.memo(TaskBottomSheet);

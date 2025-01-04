import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import BottomModal from "components/BottomModal";
import ConfirmAlert from "components/ConfirmAlert";
import Input from "components/Input";
import Typography from "components/Typography";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import { getUserId } from "modules/auth/AuthSlice";
import ColorPicker from "modules/notes/components/noteForm/ColorPicker";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../TasksApi";
import { getSubTasksByTaskId } from "../TasksSelectors";
import { TaskItem } from "../types";

import AddTaskButton from "./AddTaskButton";
import DueDatePicker from "./DueDatePicker";
import TaskDisplayItem from "./TaskDisplayItem";

type Props = {
  task: TaskItem;
  children: (openModal: () => void) => JSX.Element;
};

const TaskInfoBottomSheet = ({ task, children }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [createTask] = tasksApi.useCreateTaskMutation();
  const [updateTask] = tasksApi.useUpdateTaskMutation();
  const [deleteTask] = tasksApi.useDeleteTaskMutation();

  const userId = useAppSelector(getUserId);
  const subtasks = useAppSelector((state) =>
    getSubTasksByTaskId(state, task._id),
  );

  const completedSubtasks = useMemo(
    () => subtasks.filter((task) => task.isCompleted).length,
    [subtasks],
  );

  const [isVisible, setIsVisible] = useState(false);
  const [closeTriggered, setCloseTriggered] = useState(false);

  const [inputValue, setInputValue] = useState(task.name);
  const [currentColor, setCurrentColor] = useState(
    task.color ?? theme.colors.darkBlueText,
  );
  const [dueDate, setDueDate] = useState<number | null>(task.dueDate || null);

  const [isDeletionAlertVisible, setIsDeletionAlertVisible] = useState(false);

  const onClose = () => {
    const hasChanges =
      inputValue !== task.name ||
      dueDate !== task.dueDate ||
      currentColor !== task.color;

    if (hasChanges) {
      updateTask({
        _id: task._id,
        author: userId,
        name: inputValue.trim(),
        color: currentColor,
        dueDate: dueDate || null,
      });
    }

    setIsVisible(false);
  };

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const onDelete = useCallback(() => {
    deleteTask(task._id);
    setIsVisible(false);
  }, [deleteTask, task._id]);

  return (
    <>
      {children(openModal)}

      <BottomModal
        paddingHorizontal={16}
        withHeader={false}
        minHeight="50%"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onClose={onClose}
        closeTriggered={closeTriggered}
        setCloseTriggered={setCloseTriggered}
        bgOpacity={0.4}
      >
        <ContentContainer>
          <InputSection>
            <Input
              value={inputValue}
              paddingHorizontal={0}
              placeholder={t("tasks.taskPlaceholder")}
              isCentered
              maxLength={200}
              bgColor="transparent"
              fontSize="xl"
              fontWeight="semibold"
              onChange={setInputValue}
              labelColor={currentColor}
              LeftContent={
                <IconContainer
                  leftOffset={0}
                  hitSlop={SMALL_BUTTON_HIT_SLOP}
                  onPress={() => setIsDeletionAlertVisible(true)}
                >
                  <MaterialIcons
                    name="delete"
                    size={28}
                    color={theme.colors.red600}
                  />
                </IconContainer>
              }
              RightContent={
                <IconContainer rightOffset={0}>
                  <ColorPicker
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    isFormItem={false}
                  />
                </IconContainer>
              }
            />
            <DueDatePicker dueDate={dueDate} setDueDate={setDueDate} />
          </InputSection>
          <SubTasksSectionContainer>
            <Typography
              fontWeight="semibold"
              fontSize="xl"
              color={theme.colors.darkBlueText}
            >
              {t("tasks.subtasks")}{" "}
              <Typography color={theme.colors.darkGray}>
                {completedSubtasks}/{subtasks.length}
              </Typography>
            </Typography>
            <SubTasksContainer>
              {subtasks.map((subtask) => (
                <TaskDisplayItem key={subtask._id} task={subtask} />
              ))}
            </SubTasksContainer>
            <AddTaskButton
              inputPlaceholder={t("tasks.subtaskPlaceholder")}
              label={t("tasks.subtask")}
              onInputSubmit={({ title, color, dueDate }) =>
                createTask({
                  author: userId,
                  name: title.trim(),
                  color,
                  dueDate,
                  parentTaskId: task._id,
                })
              }
            />
          </SubTasksSectionContainer>
        </ContentContainer>
        <ConfirmAlert
          isDeletion
          message={t("general.deleteConfirmation")}
          isDialogVisible={isDeletionAlertVisible}
          setIsDialogVisible={setIsDeletionAlertVisible}
          onConfirm={onDelete}
        />
      </BottomModal>
    </>
  );
};

const ContentContainer = styled.View`
  padding-vertical: 16px;
`;

const InputSection = styled.View`
  width: 100%;
  background-color: white;
`;

const SubTasksSectionContainer = styled.View`
  margin-vertical: 12px;
  gap: 10px;
`;
const SubTasksContainer = styled.View`
  gap: 12px;
`;

const IconContainer = styled.TouchableOpacity<{
  rightOffset?: number;
  leftOffset?: number;
}>`
  position: absolute;
  ${({ rightOffset }) =>
    rightOffset !== undefined && `right: ${rightOffset}px;`}
  ${({ leftOffset }) => leftOffset !== undefined && `left: ${leftOffset}px;`}
  z-index: 1000;
`;

export default React.memo(TaskInfoBottomSheet);

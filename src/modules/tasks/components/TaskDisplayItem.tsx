import React, { useMemo } from "react";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Checkbox from "components/Checkbox";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../TasksApi";
import { getSubTasksByTaskId } from "../TasksSelectors";
import { TaskItem } from "../types";

import DueDateLabel from "./DueDateLabel";
import TaskInfoBottomSheet from "./TaskInfoBottomSheet";

const CIRCLE_SIZE = 28;

type Props = {
  task: TaskItem;
};

const TaskDisplayItem = ({ task }: Props): JSX.Element => {
  const userId = useAppSelector(getUserId);

  const [updateTask] = tasksApi.useUpdateTaskMutation();

  const subtasks = useAppSelector((state) =>
    getSubTasksByTaskId(state, task._id),
  );

  const completedSubtasks = useMemo(
    () => subtasks.filter((task) => task.isCompleted).length,
    [subtasks],
  );

  return (
    <Container>
      <CheckboxContainer
        onPress={() => {
          updateTask({
            _id: task._id,
            author: userId,
            isCompleted: !task.isCompleted,
          });
        }}
        hitSlop={BUTTON_HIT_SLOP}
      >
        <Checkbox
          isActive={!!task.isCompleted}
          size={CIRCLE_SIZE}
          iconSize={theme.fontSizes.md}
          borderRadius={6}
          iconColor={theme.colors.white}
          bgColor={task.color}
        />
      </CheckboxContainer>

      <TaskInfoBottomSheet task={task}>
        {(openModal) => (
          <InfoContainer onPress={openModal}>
            <Typography fontWeight="semibold" color={task.color}>
              {task.name}
            </Typography>
            <LabelsContainer>
              <DueDateLabel task={task} />
              {subtasks.length > 0 && (
                <LabelContainer>
                  <FontAwesome5
                    name="tasks"
                    color={task.color}
                    size={theme.fontSizes.xxs}
                  />
                  <Typography fontSize="xxs" color={task.color}>
                    {completedSubtasks}/{subtasks.length}
                  </Typography>
                </LabelContainer>
              )}
            </LabelsContainer>
          </InfoContainer>
        )}
      </TaskInfoBottomSheet>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const CheckboxContainer = styled.TouchableOpacity``;

const LabelsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InfoContainer = styled.TouchableOpacity`
  flex: 1;
`;

const LabelContainer = styled.View`
  padding: 3px 6px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export default React.memo(TaskDisplayItem);

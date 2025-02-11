import React, { useMemo } from "react";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useSubTasksByTaskId } from "modules/tasks/api/tasksSelectors";
import { calculateTasksCountInfo } from "modules/tasks/utils/calculateTasksCountInfo";
import styled from "styled-components/native";

import { TaskItem, TaskTypes } from "../../types";
import ArchivedItemLabel from "../common/ArchivedItemLabel";
import DueDateLabel from "../common/DueDateLabel";
import ItemActionsList from "../common/ItemActionsList";
import { TaskLabelContainer } from "../common/TaskLabelContainer";

import SubtasksListSection from "./SubtasksListSection";
import TaskBottomSheet from "./TaskBottomSheet";
import TaskCircularProgress from "./TaskCircularProgress";

type Props = {
  task: TaskItem;
  depth?: number;
};

const TaskDisplayItem = ({ task, depth = 0 }: Props): JSX.Element => {
  const { subTasks } = useSubTasksByTaskId(task._id);

  const { completedTasksCount, tasksCount } = useMemo(
    () => calculateTasksCountInfo(subTasks),
    [subTasks],
  );

  const isCheckType = task.type === TaskTypes.CHECK;

  return (
    <Container>
      <TaskCircularProgress task={task} />

      <TaskBottomSheet
        task={task}
        depth={depth}
        content={(closeModal) => (
          <>
            <ItemActionsList item={task} closeModal={closeModal} />
            <SubtasksListSection task={task} depth={depth} />
          </>
        )}
      >
        {(openModal) => (
          <InfoContainer onPress={openModal}>
            <Typography fontWeight="semibold" color={task.color}>
              {task.name}
            </Typography>
            <LabelsContainer>
              <DueDateLabel task={task} />
              {!isCheckType && (
                <TaskLabelContainer>
                  <FontAwesome5
                    name="sort-amount-up"
                    color={task.color}
                    size={theme.fontSizes.xs}
                  />
                  <Typography fontSize="xs" color={task.color}>
                    {task.completedAmount ?? 0}/{task.target ?? 0}{" "}
                    {task.units ?? ""}
                  </Typography>
                </TaskLabelContainer>
              )}
              {tasksCount > 0 && (
                <TaskLabelContainer>
                  <FontAwesome5
                    name="tasks"
                    color={task.color}
                    size={theme.fontSizes.xs}
                  />
                  <Typography fontSize="xs" color={task.color}>
                    {completedTasksCount}/{tasksCount}
                  </Typography>
                </TaskLabelContainer>
              )}
              <ArchivedItemLabel
                isArchived={task.isArchived}
                color={task.color}
              />
            </LabelsContainer>
          </InfoContainer>
        )}
      </TaskBottomSheet>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 10px 12px;
  elevation: 1;
`;

const LabelsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const InfoContainer = styled.TouchableOpacity`
  flex: 1;
`;

export default React.memo(TaskDisplayItem);

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { getSubTasksByTaskId } from "../../TasksSelectors";
import { TaskItem } from "../../types";

import AddTaskButton from "./AddTaskButton";
import TaskDisplayItem from "./TaskDisplayItem";

type Props = {
  task: TaskItem;
  depth?: number;
};

const SubtasksListSection = ({ task, depth = 0 }: Props): JSX.Element => {
  const { t } = useTranslation();

  const subtasks = useAppSelector((state) =>
    getSubTasksByTaskId(state, task._id),
  );

  const completedSubtasks = useMemo(
    () => subtasks.filter((task) => task.isCompleted).length,
    [subtasks],
  );

  return (
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
          <TaskDisplayItem key={subtask._id} task={subtask} depth={depth + 1} />
        ))}
      </SubTasksContainer>
      <AddTaskButton parentTaskId={task._id} />
    </SubTasksSectionContainer>
  );
};

const SubTasksSectionContainer = styled.View`
  margin-vertical: 12px;
  gap: 10px;
`;
const SubTasksContainer = styled.View`
  gap: 12px;
`;

export default React.memo(SubtasksListSection);

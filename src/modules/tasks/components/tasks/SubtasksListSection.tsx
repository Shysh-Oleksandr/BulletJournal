import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useSubTasksByTaskId } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import { TaskItem } from "../../types";

import AddTaskButton from "./AddTaskButton";
import TaskDisplayItem from "./TaskDisplayItem";

type Props = {
  task: TaskItem;
  depth?: number;
};

const SubtasksListSection = ({ task, depth = 0 }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { subTasks } = useSubTasksByTaskId(task._id);

  const completedSubtasks = useMemo(
    () => subTasks.filter((task) => task.isCompleted).length,
    [subTasks],
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
          {completedSubtasks}/{subTasks.length}
        </Typography>
      </Typography>
      <SubTasksContainer>
        {subTasks.map((subtask) => (
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

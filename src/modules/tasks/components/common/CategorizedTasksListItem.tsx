import React, { useMemo } from "react";
import theme from "theme";

import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { calculateTasksCountInfo } from "modules/tasks/utils/calculateTasksCountInfo";
import styled from "styled-components/native";

import { TaskItem } from "../../types";
import GroupItemAccordion from "../groups/GroupItemAccordion";
import AddTaskButton from "../tasks/AddTaskButton";
import TaskDisplayItem from "../tasks/TaskDisplayItem";

type Props = {
  tasks: TaskItem[];
  name: string;
  color?: string;
  defaultDueDate?: number;
};

const CategorizedTasksListItem = ({
  tasks,
  name,
  color,
  defaultDueDate,
}: Props): JSX.Element | null => {
  const { percentageCompleted, completedTasksCount, tasksCount } = useMemo(
    () => calculateTasksCountInfo(tasks),
    [tasks],
  );

  if (tasks.length === 0) return null;

  return (
    <GroupItemAccordion
      headerContent={
        <HeaderContainer>
          <Typography fontWeight="bold" color={color}>
            {name}
          </Typography>
          <LabelContainer>
            <FontAwesome5
              name="tasks"
              color={color}
              size={theme.fontSizes.xs}
            />
            <Typography fontSize="xs" color={color}>
              {completedTasksCount}/{tasksCount}
            </Typography>
          </LabelContainer>
        </HeaderContainer>
      }
      content={
        <ContentContainer>
          {tasks.map((task) => (
            <TaskDisplayItem key={task._id} task={task} />
          ))}
          <AddTaskButton defaultDueDate={defaultDueDate} />
        </ContentContainer>
      }
      viewKey={name}
      accentColor={color}
      percentageCompleted={percentageCompleted}
    />
  );
};

const HeaderContainer = styled.View``;

const ContentContainer = styled.View`
  gap: 8px;
  padding: 2px 0px 8px;
`;

const LabelContainer = styled.View`
  padding: 3px 6px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export default React.memo(CategorizedTasksListItem);

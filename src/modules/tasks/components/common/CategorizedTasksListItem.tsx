import { format, isSameDay } from "date-fns";
import React, { useMemo } from "react";
import theme from "theme";

import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { calculateTasksCountInfo } from "modules/tasks/utils/calculateTasksCountInfo";
import styled from "styled-components/native";

import { TaskItem } from "../../types";
import GroupItemAccordion from "../groups/GroupItemAccordion";
import AddTaskButton from "../tasks/AddTaskButton";
import TaskDisplayItem from "../tasks/TaskDisplayItem";

import { TaskLabelContainer } from "./TaskLabelContainer";

type Props = {
  tasks: TaskItem[];
  name: string;
  color?: string;
  defaultDueDate?: number;
  startDate?: number;
};

const CategorizedTasksListItem = ({
  tasks,
  name,
  color,
  defaultDueDate,
  startDate,
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
          <LabelsContainer>
            <TaskLabelContainer>
              <FontAwesome5
                name="tasks"
                color={color}
                size={theme.fontSizes.xs}
              />
              <Typography fontSize="xs" color={color}>
                {completedTasksCount}/{tasksCount}
              </Typography>
            </TaskLabelContainer>
            {!!startDate && !!defaultDueDate && (
              <TaskLabelContainer>
                <FontAwesome
                  name="calendar-check-o"
                  color={color}
                  size={theme.fontSizes.xs}
                />
                <Typography fontSize="xs" color={color}>
                  {`${format(startDate, "dd/MM/yyyy")}${isSameDay(startDate, defaultDueDate) ? "" : ` - ${format(defaultDueDate, "dd/MM/yyyy")}`}`}
                </Typography>
              </TaskLabelContainer>
            )}
          </LabelsContainer>
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

const LabelsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default React.memo(CategorizedTasksListItem);

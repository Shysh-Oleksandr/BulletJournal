import { format, isAfter, isPast } from "date-fns";
import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";

import { TaskItem } from "../../types";

import { TaskLabelContainer } from "./TaskLabelContainer";

type Props = {
  task: TaskItem;
};

const DueDateLabel = ({ task }: Props): JSX.Element | null => {
  const isPastDueDate = task.dueDate && isPast(task.dueDate);

  const dueDateColor = isPastDueDate ? theme.colors.red600 : task.color;

  const isCompletedPastDueDate =
    task.completedAt && task.dueDate && isAfter(task.completedAt, task.dueDate);

  if (!task.dueDate && !task.completedAt) return null;

  return (
    <>
      {task.completedAt && (
        <TaskLabelContainer>
          <FontAwesome
            name="calendar-check-o"
            color={task.color}
            size={theme.fontSizes.xs}
          />
          <Typography fontSize="xs" color={task.color}>
            {format(task.completedAt, "dd/MM/yyyy")}
          </Typography>
        </TaskLabelContainer>
      )}
      {task.dueDate && (!task.completedAt || isCompletedPastDueDate) && (
        <TaskLabelContainer>
          <FontAwesome
            name="calendar-times-o"
            color={dueDateColor}
            size={theme.fontSizes.xs}
          />
          <Typography fontSize="xs" color={dueDateColor}>
            {format(task.dueDate, "dd/MM/yyyy")}
          </Typography>
        </TaskLabelContainer>
      )}
    </>
  );
};

export default React.memo(DueDateLabel);

import { format, isPast } from "date-fns";
import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import styled from "styled-components/native";

import { TaskItem } from "../types";

type Props = {
  task: TaskItem;
};

const DueDateLabel = ({ task }: Props): JSX.Element | null => {
  const isPastDueDate = task.dueDate && isPast(task.dueDate);

  const color = isPastDueDate ? theme.colors.red600 : task.color;

  if (!task.dueDate) return null;

  return (
    <LabelContainer>
      <FontAwesome
        name="calendar-check-o"
        color={color}
        size={theme.fontSizes.xxs}
      />
      <Typography fontSize="xxs" color={color}>
        {format(task.dueDate, "dd/MM/yyyy")}
      </Typography>
    </LabelContainer>
  );
};

const LabelContainer = styled.View`
  padding: 3px 6px;
  border-radius: 6px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export default React.memo(DueDateLabel);

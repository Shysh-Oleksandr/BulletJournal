import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import { LabelWithTasks } from "modules/tasks/types";
import styled from "styled-components/native";

import AddTaskButton from "../tasks/AddTaskButton";
import TaskDisplayItem from "../tasks/TaskDisplayItem";

import ItemInfoBottomSheet from "./ItemInfoBottomSheet";

type Props = {
  label: LabelWithTasks;
};

const CategorizedTasksByLabelsItem = ({ label }: Props): JSX.Element => (
  <ItemInfoBottomSheet
    bottomModalProps={{
      minHeight: "49%",
      withHeader: true,
      title: label.labelName,
      titleColor: label.color,
    }}
    content={() => (
      <TasksContainer>
        {label.tasks.map((task) => (
          <TaskDisplayItem key={task._id} task={task} depth={1} />
        ))}
        <AddTaskButton
          defaultColor={label.color}
          defaultCustomLabels={[label._id]}
        />
      </TasksContainer>
    )}
  >
    {(openModal) => (
      <LabelContainer
        key={label.labelName}
        bgColor={label.color}
        onPress={openModal}
      >
        <Typography fontWeight="semibold" color={theme.colors.white}>
          {label.labelName}
          {label.activeTasksAmount > 0 ? ` (${label.activeTasksAmount})` : ""}
        </Typography>
      </LabelContainer>
    )}
  </ItemInfoBottomSheet>
);

const LabelContainer = styled.TouchableOpacity<{ bgColor: string }>`
  padding: 4px 6px;
  border-radius: 8px;
  background-color: ${({ bgColor }) => bgColor};
`;

const TasksContainer = styled.View`
  gap: 12px;
`;

export default React.memo(CategorizedTasksByLabelsItem);

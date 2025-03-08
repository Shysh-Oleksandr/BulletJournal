import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import Typography from "components/Typography";
import { useArchivedTasksByGroupId } from "modules/tasks/api/tasksSelectors";
import styled from "styled-components/native";

import TaskDisplayItem from "../tasks/TaskDisplayItem";

type Props = {
  groupId: string;
};

const ArchivedSubtasksListSection = ({
  groupId,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const { archivedTasks } = useArchivedTasksByGroupId(groupId);

  if (!archivedTasks.length) return null;

  return (
    <ArchivedTasksContainer>
      <Typography
        fontWeight="semibold"
        fontSize="xl"
        color={theme.colors.darkBlueText}
      >
        {t("habits.theArchive")}:
      </Typography>
      {archivedTasks.map((task) => (
        <TaskDisplayItem key={task._id} task={task} />
      ))}
    </ArchivedTasksContainer>
  );
};

const ArchivedTasksContainer = styled.View`
  width: 100%;
  padding: 2px 0px 8px;
  gap: 8px;
`;

export default React.memo(ArchivedSubtasksListSection);

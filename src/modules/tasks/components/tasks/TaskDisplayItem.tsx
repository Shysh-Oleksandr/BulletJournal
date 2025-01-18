import React from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import Typography from "components/Typography";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { getSubTasksCountInfoByTaskId } from "../../TasksSelectors";
import { TaskItem, TaskTypes } from "../../types";
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
  const { t } = useTranslation();

  const { completedTasksCount, tasksCount } = useAppSelector((state) =>
    getSubTasksCountInfoByTaskId(state, task._id),
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
              {task.isArchived && (
                <TaskLabelContainer>
                  <Entypo
                    name="archive"
                    size={theme.fontSizes.xs}
                    color={task.color}
                  />
                  <Typography fontSize="xs" color={task.color}>
                    {t("habits.theArchive")}
                  </Typography>
                </TaskLabelContainer>
              )}
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
`;

const InfoContainer = styled.TouchableOpacity`
  flex: 1;
`;

export default React.memo(TaskDisplayItem);

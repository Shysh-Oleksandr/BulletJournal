import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../TasksApi";
import { getSubGroupsByGroupId, getTasksByGroupId } from "../TasksSelectors";
import { GroupItem } from "../types";

import AddItemButtonsContainer from "./AddItemButtonsContainer";
import AddTaskButton from "./AddTaskButton";
import EditTaskItemModal from "./EditTaskItemModal";
import TaskDisplayItem from "./TaskDisplayItem";
import TaskGroupItemAccordion from "./TaskGroupItemAccordion";

type Props = {
  group: GroupItem;
};

const TaskGroupDisplayItem = ({ group }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [createGroup] = tasksApi.useCreateGroupMutation();
  const [updateGroup] = tasksApi.useUpdateGroupMutation();
  const [deleteGroup] = tasksApi.useDeleteGroupMutation();
  const [createTask] = tasksApi.useCreateTaskMutation();

  const userId = useAppSelector(getUserId);
  const subGroups = useAppSelector((state) =>
    getSubGroupsByGroupId(state, group._id),
  );
  const tasks = useAppSelector((state) => getTasksByGroupId(state, group._id));

  return (
    <Container>
      <TaskGroupItemAccordion
        headerContent={
          <EditTaskItemModal
            onInputSubmit={({ title, color }) =>
              updateGroup({
                _id: group._id,
                author: userId,
                name: title.trim(),
                color,
              })
            }
            onDelete={() => deleteGroup(group._id)}
            inputPlaceholder={t("tasks.groupPlaceholder")}
            withDueDatePicker={false}
            defaultTitle={group.name}
            defaultColor={group.color}
          >
            {(openModal) => (
              <HeaderInfo onPress={openModal}>
                <Typography
                  fontWeight="bold"
                  fontSize="lg"
                  color={group.color}
                  paddingBottom={6}
                >
                  {group.name}
                </Typography>
                <Typography fontSize="sm" color={group.color}>
                  {subGroups.length > 0
                    ? `${t("tasks.subgroups")}: ${subGroups.length}, `
                    : ""}
                  {t("tasks.tasks")}: {tasks.length}
                </Typography>
              </HeaderInfo>
            )}
          </EditTaskItemModal>
        }
        content={
          <ContentContainer>
            {subGroups.map((subGroup) => (
              <TaskGroupDisplayItem key={subGroup._id} group={subGroup} />
            ))}
            {tasks.map((task) => (
              <TaskDisplayItem key={task._id} task={task} />
            ))}
            <AddItemButtonsContainer isDark={!!group.parentGroupId}>
              <AddTaskButton
                inputPlaceholder={t("tasks.taskPlaceholder")}
                label={t("tasks.task")}
                onInputSubmit={({ title, color, dueDate }) =>
                  createTask({
                    author: userId,
                    name: title.trim(),
                    color,
                    groupId: group._id,
                    dueDate,
                  })
                }
              />
              <AddTaskButton
                inputPlaceholder={t("tasks.subgroupPlaceholder")}
                label={t("tasks.subgroup")}
                onInputSubmit={({ title, color }) =>
                  createGroup({
                    author: userId,
                    name: title.trim(),
                    color,
                    parentGroupId: group._id,
                  })
                }
                withDueDatePicker={false}
                isDark
              />
            </AddItemButtonsContainer>
          </ContentContainer>
        }
        viewKey={group._id}
        accentColor={group.color}
      />
    </Container>
  );
};

const Container = styled.View``;

const ContentContainer = styled.View`
  width: 100%;
  padding: 2px 0px 8px;
  gap: 8px;
`;

const HeaderInfo = styled.TouchableOpacity``;

export default React.memo(TaskGroupDisplayItem);

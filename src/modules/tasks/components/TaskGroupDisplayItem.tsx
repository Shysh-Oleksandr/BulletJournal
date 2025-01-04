import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../TasksApi";
import { getProjectsByGroupId, getSubGroupsByGroupId } from "../TasksSelectors";
import { GroupItem } from "../types";

import AddItemButtonsContainer from "./AddItemButtonsContainer";
import AddTaskButton from "./AddTaskButton";
import EditTaskItemModal from "./EditTaskItemModal";
import ProjectDisplayItem from "./ProjectDisplayItem";
import TaskGroupItemAccordion from "./TaskGroupItemAccordion";

type Props = {
  group: GroupItem;
};

const TaskGroupDisplayItem = ({ group }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [createGroup] = tasksApi.useCreateGroupMutation();
  const [updateGroup] = tasksApi.useUpdateGroupMutation();
  const [deleteGroup] = tasksApi.useDeleteGroupMutation();
  const [createProject] = tasksApi.useCreateProjectMutation();

  const userId = useAppSelector(getUserId);
  const subGroups = useAppSelector((state) =>
    getSubGroupsByGroupId(state, group._id),
  );
  const projects = useAppSelector((state) =>
    getProjectsByGroupId(state, group._id),
  );

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
                  {t("tasks.projects")}: {projects.length}
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
            {projects.map((project) => (
              <ProjectDisplayItem key={project._id} project={project} />
            ))}
            <AddItemButtonsContainer isDark={!!group.parentGroupId}>
              <AddTaskButton
                inputPlaceholder={t("tasks.projectPlaceholder")}
                label={t("tasks.project")}
                onInputSubmit={({ title, color, dueDate }) =>
                  createProject({
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

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import AddItemButtonsContainer from "../components/AddItemButtonsContainer";
import AddTaskButton from "../components/AddTaskButton";
import TaskDisplayItem from "../components/TaskDisplayItem";
import TaskGroupDisplayItem from "../components/TaskGroupDisplayItem";
import { useFetchTaskElements } from "../hooks/useFetchTaskElements";
import { tasksApi } from "../TasksApi";
import { getOrphanedGroups, getOrphanedTasks } from "../TasksSelectors";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 40,
  paddingHorizontal: 16,
};

const TasksScreen = (): JSX.Element => {
  const [createGroup] = tasksApi.useCreateGroupMutation();
  const [createTask] = tasksApi.useCreateTaskMutation();

  const { t } = useTranslation();

  const userId = useAppSelector(getUserId);
  const orphanedGroups = useAppSelector(getOrphanedGroups);
  const orphanedTasks = useAppSelector(getOrphanedTasks);

  const isLoading = useFetchTaskElements();

  return (
    <>
      <HeaderBar title={t("tasks.tasks")} />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        {isLoading ? (
          <LoaderContainer>
            <ActivityIndicator size="large" color={theme.colors.cyan600} />
          </LoaderContainer>
        ) : (
          <Container
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
            automaticallyAdjustKeyboardInsets
            keyboardShouldPersistTaps="always"
          >
            <TaskGroupsContainer>
              <Typography
                fontSize="lg"
                color={theme.colors.cyan700}
                fontWeight="semibold"
              >
                {t("tasks.groups")}:
              </Typography>
              <ItemListContainer>
                {orphanedGroups.map((group) => (
                  <TaskGroupDisplayItem key={group._id} group={group} />
                ))}
              </ItemListContainer>
              <Typography
                fontSize="lg"
                color={theme.colors.cyan700}
                fontWeight="semibold"
              >
                {t("tasks.tasks")}:
              </Typography>
              <ItemListContainer>
                {orphanedTasks.map((task) => (
                  <TaskDisplayItem key={task._id} task={task} />
                ))}
              </ItemListContainer>
              <AddItemButtonsContainer>
                <AddTaskButton
                  inputPlaceholder={t("tasks.groupPlaceholder")}
                  label={t("tasks.group")}
                  onInputSubmit={({ title, color }) =>
                    createGroup({ author: userId, name: title.trim(), color })
                  }
                  withDueDatePicker={false}
                />
                <AddTaskButton
                  inputPlaceholder={t("tasks.taskPlaceholder")}
                  label={t("tasks.task")}
                  onInputSubmit={({ title, color, dueDate }) =>
                    createTask({
                      author: userId,
                      name: title.trim(),
                      color,
                      dueDate,
                    })
                  }
                />
              </AddItemButtonsContainer>
            </TaskGroupsContainer>
          </Container>
        )}
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const Container = styled.ScrollView``;

const TaskGroupsContainer = styled.View`
  gap: 12px;
`;

const ItemListContainer = styled.View`
  gap: 6px;
`;

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

export default TasksScreen;

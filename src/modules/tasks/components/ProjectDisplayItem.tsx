import { format } from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesome } from "@expo/vector-icons";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import { tasksApi } from "../TasksApi";
import { getTasksByProjectId } from "../TasksSelectors";
import { ProjectItem, TaskItem } from "../types";

import AddTaskButton from "./AddTaskButton";
import EditTaskItemModal from "./EditTaskItemModal";
import TaskDisplayItem from "./TaskDisplayItem";
import TaskGroupItemAccordion from "./TaskGroupItemAccordion";

type Props = {
  project: ProjectItem;
};

const ProjectDisplayItem = ({ project }: Props): JSX.Element => {
  const { t } = useTranslation();

  const userId = useAppSelector(getUserId);

  const [createTask] = tasksApi.useCreateTaskMutation();
  const [updateProject] = tasksApi.useUpdateProjectMutation();
  const [deleteProject] = tasksApi.useDeleteProjectMutation();

  const tasks = useAppSelector((state) =>
    getTasksByProjectId(state, project._id),
  );

  const { percentageCompleted, totalCompletedTasks } = useMemo(() => {
    if (!tasks.length)
      return { percentageCompleted: 0, totalCompletedTasks: 0 };

    const totalCompletedTasks = tasks.reduce(
      (prev, next) => prev + (next.isCompleted ? 1 : 0),
      0,
    );

    const percentageCompleted = Math.min(
      (totalCompletedTasks / (tasks.length || 0)) * 100,
      100,
    );

    return {
      percentageCompleted,
      totalCompletedTasks,
    };
  }, [tasks]);

  return (
    <TaskGroupItemAccordion
      key={project._id}
      percentageCompleted={percentageCompleted}
      headerContent={
        <EditTaskItemModal
          onInputSubmit={({ title, color, dueDate }) =>
            updateProject({
              _id: project._id,
              author: userId,
              name: title.trim(),
              color,
              dueDate,
            })
          }
          onDelete={() => deleteProject(project._id)}
          inputPlaceholder={t("tasks.projectPlaceholder")}
          defaultTitle={project.name}
          defaultColor={project.color}
        >
          {(openModal) => (
            <HeaderInfo onPress={openModal}>
              <Typography
                textBreakStrategy="balanced"
                fontWeight="semibold"
                paddingRight={8}
                color={project.color}
                paddingBottom={6}
              >
                {project.name}
              </Typography>
              <Row>
                <Typography
                  fontSize="sm"
                  color={project.color}
                  paddingRight={8}
                >
                  {t("tasks.tasks")}:{" "}
                  {tasks.length === 0
                    ? "0"
                    : `${totalCompletedTasks}/${tasks.length}`}
                </Typography>
                {project.dueDate && (
                  <>
                    <FontAwesome
                      name="calendar-check-o"
                      color={project.color}
                      size={13}
                    />
                    <Typography
                      fontSize="xs"
                      paddingLeft={4}
                      color={project.color}
                    >
                      {format(project.dueDate, "dd.MM.yyyy")}
                    </Typography>
                  </>
                )}
              </Row>
            </HeaderInfo>
          )}
        </EditTaskItemModal>
      }
      content={
        <ContentContainer>
          {tasks.map((task: TaskItem) => (
            <TaskDisplayItem key={task._id} task={task} />
          ))}
          <AddTaskButton
            inputPlaceholder={t("tasks.taskPlaceholder")}
            label={t("tasks.task")}
            onInputSubmit={({ title, color, dueDate }) =>
              createTask({
                author: userId,
                name: title.trim(),
                color,
                dueDate,
                projectId: project._id,
              })
            }
          />
        </ContentContainer>
      }
      viewKey={project._id}
      accentColor={project.color}
    />
  );
};

const ContentContainer = styled.View`
  width: 100%;
  padding: 2px 0px 8px;
  gap: 8px;
`;

const HeaderInfo = styled.TouchableOpacity``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export default React.memo(ProjectDisplayItem);

import { isPast } from "date-fns";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { useAllTasks } from "modules/tasks/api/tasksSelectors";
import { PERIODS_DATA } from "modules/tasks/data";
import { TaskItem } from "modules/tasks/types";
import styled from "styled-components/native";

import CategorizedTasksByPeriodListItem from "./CategorizedTasksByPeriodListItem";
import CategorizedTasksListItem from "./CategorizedTasksListItem";

const contentContainerStyle = {
  paddingBottom: 40,
  paddingHorizontal: 16,
};

const CategorizedTasksSection = (): JSX.Element => {
  const { t } = useTranslation();

  const { allTasks } = useAllTasks();

  const { archivedTasks, tasksWithoutDueDate, completedPastTasks } =
    useMemo(() => {
      const archivedTasks: TaskItem[] = [];
      const tasksWithoutDueDate: TaskItem[] = [];
      const completedPastTasks: TaskItem[] = [];

      allTasks.forEach((task) => {
        if (task.isArchived) {
          archivedTasks.push(task);
        }
        if (!task.dueDate) {
          tasksWithoutDueDate.push(task);
        }
        if (task.isCompleted && task.dueDate && isPast(task.dueDate)) {
          completedPastTasks.push(task);
        }
      });

      return {
        archivedTasks,
        tasksWithoutDueDate,
        completedPastTasks,
      };
    }, [allTasks]);

  return (
    <Container
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
    >
      <CategoryContainer>
        {PERIODS_DATA.map((period) => (
          <CategorizedTasksByPeriodListItem
            key={period.name}
            taskCategoryPeriod={period}
          />
        ))}
        <CategorizedTasksListItem
          tasks={tasksWithoutDueDate}
          name={t("tasks.noDueDate")}
        />
        <CategorizedTasksListItem
          tasks={completedPastTasks}
          name={t("tasks.previouslyCompleted")}
          color={theme.colors.green700}
        />
        <CategorizedTasksListItem
          tasks={archivedTasks}
          name={t("habits.theArchive")}
          color={theme.colors.darkGray}
        />
      </CategoryContainer>
    </Container>
  );
};

const Container = styled.ScrollView``;

const CategoryContainer = styled.View`
  border-radius: 6px;
  gap: 4px;
`;

export default React.memo(CategorizedTasksSection);

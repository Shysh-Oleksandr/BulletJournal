import React from "react";
import { useTranslation } from "react-i18next";

import { PERIODS_DATA } from "modules/tasks/data";
import {
  getArchivedTasks,
  getTasksWithoutDueDate,
} from "modules/tasks/TasksSelectors";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import CategorizedTasksByPeriodListItem from "./CategorizedTasksByPeriodListItem";
import CategorizedTasksListItem from "./CategorizedTasksListItem";

const contentContainerStyle = {
  paddingBottom: 40,
  paddingHorizontal: 16,
};

const CategorizedTasksSection = (): JSX.Element => {
  const { t } = useTranslation();

  const archivedTasks = useAppSelector(getArchivedTasks);
  const tasksWithoutDueDate = useAppSelector(getTasksWithoutDueDate);

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
          tasks={archivedTasks}
          name={t("habits.theArchive")}
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

import React from "react";
import { useTranslation } from "react-i18next";

import { useTasksWithinPeriod } from "modules/tasks/api/tasksSelectors";

import { TaskCategoryPeriod } from "../../types";

import CategorizedTasksListItem from "./CategorizedTasksListItem";

type Props = {
  taskCategoryPeriod: TaskCategoryPeriod;
};

const CategorizedTasksByPeriodListItem = ({
  taskCategoryPeriod,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const { tasks } = useTasksWithinPeriod(
    taskCategoryPeriod.start,
    taskCategoryPeriod.end,
  );

  return (
    <CategorizedTasksListItem
      tasks={tasks}
      name={t("tasks.categories." + taskCategoryPeriod.name)}
      color={taskCategoryPeriod.color}
      defaultDueDate={taskCategoryPeriod.end}
      startDate={taskCategoryPeriod.start}
    />
  );
};

export default React.memo(CategorizedTasksByPeriodListItem);

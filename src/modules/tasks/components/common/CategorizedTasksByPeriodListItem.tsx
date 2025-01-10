import React from "react";
import { useTranslation } from "react-i18next";

import { getTasksWithinPeriod } from "modules/tasks/TasksSelectors";
import { useAppSelector } from "store/helpers/storeHooks";

import { TaskCategoryPeriod } from "../../types";

import CategorizedTasksListItem from "./CategorizedTasksListItem";

type Props = {
  taskCategoryPeriod: TaskCategoryPeriod;
};

const CategorizedTasksByPeriodListItem = ({
  taskCategoryPeriod,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const tasks = useAppSelector((state) =>
    getTasksWithinPeriod(
      state,
      taskCategoryPeriod.start,
      taskCategoryPeriod.end,
    ),
  );

  return (
    <CategorizedTasksListItem
      tasks={tasks}
      name={t("tasks.categories." + taskCategoryPeriod.name)}
      color={taskCategoryPeriod.color}
      defaultDueDate={taskCategoryPeriod.end}
    />
  );
};

export default React.memo(CategorizedTasksByPeriodListItem);

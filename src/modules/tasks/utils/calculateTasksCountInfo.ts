import { TaskItem } from "../types";

export const calculateTasksCountInfo = (tasks: TaskItem[]) => {
  if (!tasks.length)
    return { completedTasksCount: 0, tasksCount: 0, percentageCompleted: 0 };

  const completedTasksCount = tasks.filter((task) => task.isCompleted).length;

  const percentageCompleted = Math.min(
    (completedTasksCount / tasks.length) * 100,
    100,
  );

  return {
    completedTasksCount,
    tasksCount: tasks.length,
    percentageCompleted,
  };
};

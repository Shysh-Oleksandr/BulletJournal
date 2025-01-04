type CommonTaskItem = {
  _id: string;
  author: string;
  name: string;
  color?: string;
};

export type GroupItem = CommonTaskItem & {
  parentGroupId?: string;
};

export type ProjectItem = CommonTaskItem & {
  groupId?: string;
  dueDate?: number | null;
  target?: number;
  units?: string;
  completedAmount?: number;
};

export type TaskItem = CommonTaskItem & {
  isCompleted?: boolean;
  projectId?: string;
  dueDate?: number | null;
  percentageCompleted?: number;
  parentTaskId?: string;
};

export type GroupsState = {
  byId: Record<string, GroupItem>;
  allIds: string[];
};

export type ProjectsState = {
  byId: Record<string, ProjectItem>;
  allIds: string[];
};

export type TasksState = {
  byId: Record<string, TaskItem>;
  allIds: string[];
};

export type CreateGroupResponse = {
  group: GroupItem;
};

export type CreateGroupRequest = Omit<
  GroupItem,
  "_id" | "subGroupIds" | "projectIds"
>;

export type UpdateGroupRequest = Partial<CreateGroupRequest> &
  Pick<GroupItem, "_id" | "author">;

export type CreateProjectResponse = {
  project: ProjectItem;
};

export type CreateProjectRequest = Omit<ProjectItem, "_id" | "taskIds">;

export type UpdateProjectRequest = Partial<CreateProjectRequest> &
  Pick<ProjectItem, "_id" | "author">;

export type CreateTaskResponse = {
  task: TaskItem;
};

export type CreateTaskRequest = Omit<TaskItem, "_id" | "subTaskIds">;

export type UpdateTaskRequest = Partial<CreateTaskRequest> &
  Pick<TaskItem, "_id" | "author">;

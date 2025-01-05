type CommonTaskItem = {
  _id: string;
  author: string;
  name: string;
  color?: string;
};

export type GroupItem = CommonTaskItem & {
  parentGroupId?: string;
};

export type TaskItem = CommonTaskItem & {
  groupId?: string;
  parentTaskId?: string;
  dueDate?: number | null;
  isCompleted?: boolean;
  target?: number;
  units?: string;
  completedAmount?: number;
};

export type GroupsState = {
  byId: Record<string, GroupItem>;
  allIds: string[];
};

export type TasksState = {
  byId: Record<string, TaskItem>;
  allIds: string[];
};

export type CreateGroupResponse = {
  group: GroupItem;
};

export type CreateGroupRequest = Omit<GroupItem, "_id">;

export type UpdateGroupRequest = Partial<CreateGroupRequest> &
  Pick<GroupItem, "_id" | "author">;

export type CreateTaskResponse = {
  task: TaskItem;
};

export type CreateTaskRequest = Omit<TaskItem, "_id">;

export type UpdateTaskRequest = Partial<CreateTaskRequest> &
  Pick<TaskItem, "_id" | "author">;

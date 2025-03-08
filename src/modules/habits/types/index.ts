export type HabitLog = {
  date: number;
  percentageCompleted: number;
  amount?: number;
  amountTarget?: number;
  note?: string;
  isManuallyOptional?: boolean;
  isOptional?: boolean;
  isArtificial?: boolean;
};

export type Habit = {
  _id: string;
  author: string;
  label: string;
  description?: string;
  amountTarget?: number | null;
  units?: string;
  streakTarget: number;
  overallTarget: number;
  frequency: HabitFrequency;
  habitType: HabitTypes;
  color: string;
  logs: HabitLog[];
  isArchived?: boolean;
  order?: number;
  // Custom FE fields
  oldestLogDate?: number;
};

export type HabitFrequency = {
  days: number;
  period: HabitPeriods;
};

export enum HabitPeriods {
  WEEK = "week",
  MONTH = "month",
}

export enum HabitTypes {
  CHECK = "CHECK",
  AMOUNT = "AMOUNT",
  TIME = "TIME",
}

export type HabitStreak = {
  startDate: Date;
  endDate: Date;
  lastOptionalLogDate: Date;
  numberOfDays: number;
};

export type FetchHabitsResponse = {
  count: number;
  habits: Habit[];
};

export type HabitsState = {
  byId: Record<string, Habit>;
  allIds: string[];
};

export type UpdateHabitRequest = Partial<Habit> &
  Pick<Habit, "_id" | "author"> & {
    withDeepClone?: boolean;
  };

export type CreateHabitResponse = {
  habit: Habit;
};

export type CreateHabitRequest = Omit<Habit, "_id">;

export type DeleteHabitRequest = {
  _id: string;
  userId: string;
};

export type ReorderHabitsRequest = {
  userId: string;
  habitIds: string[];
};

export enum HabitActions {
  ARCHIVE = "archive",
  UNARCHIVE = "unarchive",
  DELETE = "delete",
  RESTORE = "restore",
}

export type BulkEditHabit = {
  _id: string;
  label: string;
  action: HabitActions;
  isSelected: boolean;
};

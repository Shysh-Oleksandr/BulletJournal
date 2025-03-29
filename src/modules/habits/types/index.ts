export type HabitLog = {
  _id: string;
  date: number;
  percentageCompleted: number;
  amount?: number;
  amountTarget?: number;
  note?: string;
  isManuallyOptional?: boolean;
  habitId: string;
  // FE fields:
  isOptional?: boolean;
  isArtificial?: boolean;
};

export type CreateHabitLogRequest = Omit<HabitLog, "_id">;
export type UpdateHabitLogRequest = Partial<HabitLog> &
  Pick<HabitLog, "_id" | "habitId">;

export type CreateHabitLogResponse = {
  habitLog: HabitLog;
};
export type UpdateHabitLogResponse = CreateHabitLogResponse;

export type Habit = {
  _id: string;
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

export type HabitsState = {
  byId: Record<string, Habit>;
  allIds: string[];
};

export type UpdateHabitRequest = Partial<Habit> &
  Pick<Habit, "_id"> & {
    withDeepClone?: boolean;
  };

export type CreateHabitResponse = {
  habit: Habit;
};

export type CreateHabitRequest = Omit<Habit, "_id" | "logs">;

export type DeleteHabitRequest = {
  _id: string;
};

export type ReorderHabitsRequest = {
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

export type HabitLog = {
  date: number;
  percentageCompleted: number;
  amount?: number;
  amountTarget?: number;
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

export type UpdateHabitRequest = Partial<Habit> & Pick<Habit, "_id" | "author">;

export type CreateHabitResponse = {
  habit: Habit;
};

export type CreateHabitRequest = Omit<Habit, "_id">;

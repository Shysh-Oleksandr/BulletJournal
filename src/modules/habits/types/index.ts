export type HabitLog = {
  date: number;
  percentageCompleted: number;
  amount?: number;
  amountTarget?: number;
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
  startDate: number; // ?
  frequency: {
    weekdays: number[];
  };
  habitType: HabitTypes;
  color: string;
  logs: HabitLog[];
};

export enum HabitTypes {
  CHECK = "CHECK",
  AMOUNT = "AMOUNT",
  TIME = "TIME",
}

export type HabitStreak = {
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
};

export type FetchHabitsResponse = {
  count: number;
  habits: Habit[];
};

export type UpdateHabitRequest = Partial<Habit> & Pick<Habit, "_id" | "author">;

export type CreateHabitResponse = {
  habit: Habit;
};

export type CreateHabitRequest = Omit<Habit, "_id">;

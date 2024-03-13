export type HabitLog = {
  date: number;
  completed: boolean;
};

export type Habit = {
  _id: string;
  author: string;
  label: string;
  description?: string;
  goal: number;
  startDate: number;
  color: string;
  logs: HabitLog[];
};

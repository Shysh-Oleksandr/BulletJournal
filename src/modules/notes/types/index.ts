export type Note = {
  _id: string;
  author: string;
  title: string;
  content: string;
  color: string;
  startDate: number;
  endDate: number;
  rating: number;
  isLocked: boolean;
  isStarred: boolean;
  type: Category | null;
  category: Category[];
};

export type Category = {
  _id: string;
  labelName: string;
  isCategoryLabel: boolean;
  color: string;
  user: string;
};

export type FetchNotesResponse = {
  count: number;
  notes: Note[];
};

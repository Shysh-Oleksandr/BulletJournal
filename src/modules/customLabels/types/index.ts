export interface CustomLabel {
  labelName: string;
  color: string;
  isCategoryLabel?: boolean;
  user: string; // userId
  labelFor: LabelFor;
  refId?: string;
  _id: string;
}

export type FetchLabelsResponse = {
  count: number;
  customLabels: CustomLabel[];
};

export type UpdateLabelRequest = CustomLabel;

export type CreateLabelResponse = {
  customLabel: CustomLabel;
};

export type CreateLabelRequest = Omit<CustomLabel, "_id">;

export type LabelFor = "Note" | "Type" | "Category" | "Task";

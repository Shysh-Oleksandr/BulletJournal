export interface CustomLabel {
  labelName: string;
  color: string;
  isCategoryLabel?: boolean;
  labelFor: LabelFor;
  refId?: string;
  _id: string;
}

export type FetchLabelsResponse = CustomLabel[];

export type UpdateLabelRequest = CustomLabel;

export type CreateLabelResponse = {
  customLabel: CustomLabel;
};

export type CreateLabelRequest = Omit<CustomLabel, "_id">;

export type LabelFor = "Type" | "Category" | "Task";

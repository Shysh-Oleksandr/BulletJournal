import { CustomLabel } from "modules/customLabels/types";

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
  images: Image[];
  type: CustomLabel | null;
  category: CustomLabel[];
};

export interface Image {
  url: string;
  author: string; // userId
  noteId?: string; // expected that `noteId` is always presented despite being optional
  _id: string;
}

export type FetchNotesResponse = {
  count: number;
  notes: Note[];
};

export type UpdateNoteRequest = Omit<Note, "type" | "category" | "images"> & {
  type: string | null;
  category: string[];
  images: string[];
};

export type CreateNoteResponse = {
  note: Note;
};

export type CreateImagesResponse = {
  createdImages: Image[];
};

export type CreateNoteRequest = Omit<
  Note,
  "_id" | "type" | "category" | "images"
> & {
  type: string | null;
  category: string[];
  images: string[];
};

export type CreateImagesRequest = Pick<Image, "author" | "noteId"> & {
  urls: string[];
};

export type DeleteImagesRequest = {
  imageIdsToDelete: string[];
};

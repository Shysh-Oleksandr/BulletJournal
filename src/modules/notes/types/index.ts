import { CustomLabel } from "modules/customLabels/types";

export type Note = {
  _id: string;
  author: string;
  title: string;
  content: string;
  color: string;
  startDate: number;
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

export type UpdateNoteRequest = Omit<
  Note,
  "type" | "category" | "images" | "author"
> & {
  type: string | null;
  category: string[];
  images: string[];
};

export type CreateNoteResponse = Note;

export type CreateImagesResponse = {
  images: Image[];
};

export type FetchPaginatedNotesResponse = {
  data: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type FetchPaginatedNotesRequest = {
  page?: number;
  limit?: number;
};

export type CreateNoteRequest = Omit<
  Note,
  "_id" | "type" | "category" | "images" | "author" | "isLocked"
> & {
  type: string | null;
  category: string[];
  images: string[];
};

export type CreateImagesRequest = Pick<Image, "noteId"> & {
  urls: string[];
};

export type DeleteImagesRequest = {
  imageIds: string[];
};

export default interface User {
  _id: string;
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  customNoteTypes?: string;
  customNoteCategories?: string;
}

export const DEFAULT_USER: User = {
  _id: "",
  uid: "",
  name: "",
  createdAt: "",
  updatedAt: "",
};
export const DEFAULT_FIRE_TOKEN = "";

export type LoginResponse = {
  user: User;
};

export type LoginRequest = {
  uid: string;
  fire_token: string;
};

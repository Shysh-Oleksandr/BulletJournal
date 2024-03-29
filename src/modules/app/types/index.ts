export enum CustomUserEvents {
  SIGN_IN = "sign_in",
  SIGN_OUT = "sign_out",
  SCROLL_TO_TOP = "scroll_to_top",
  ADD_ICON_PRESS = "add_icon_press",
  CREATE_NOTE = "create_note",
  SAVE_NOTE = "save_note",
  CREATE_LABEL = "create_label",
  UPDATE_LABEL = "update_label",
  DELETE_LABEL = "delete_label",
  DELETE_NOTE = "delete_note",
  CREATE_HABIT = "create_habit",
  SAVE_HABIT = "save_habit",
  DELETE_HABIT = "delete_habit",
  PICK_IMAGE_FROM_GALLERY = "pick_image_from_gallery",
  MAKE_A_PHOTO = "make_a_photo",
}

export type UserEventsStackParamList = {
  [CustomUserEvents.SIGN_IN]: { uid: string };
  [CustomUserEvents.SIGN_OUT]: undefined;
  [CustomUserEvents.SCROLL_TO_TOP]: undefined;
  [CustomUserEvents.ADD_ICON_PRESS]: undefined;
  [CustomUserEvents.CREATE_NOTE]: undefined;
  [CustomUserEvents.SAVE_NOTE]: { noteId: string };
  [CustomUserEvents.DELETE_NOTE]: { noteId: string };
  [CustomUserEvents.CREATE_LABEL]: undefined;
  [CustomUserEvents.UPDATE_LABEL]: { labelId: string };
  [CustomUserEvents.DELETE_LABEL]: { labelId: string };
  [CustomUserEvents.CREATE_HABIT]: undefined;
  [CustomUserEvents.SAVE_HABIT]: { habitId: string };
  [CustomUserEvents.DELETE_HABIT]: { habitId: string };
  [CustomUserEvents.PICK_IMAGE_FROM_GALLERY]: undefined;
  [CustomUserEvents.MAKE_A_PHOTO]: undefined;
};

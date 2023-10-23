import { Note } from "../types";

import { EMPTY_NOTE } from "./../data/index";

export const getEmptyNote = (): Note => {
  return {
    ...EMPTY_NOTE,
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
  };
};

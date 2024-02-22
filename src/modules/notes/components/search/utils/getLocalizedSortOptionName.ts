import i18n from "localization/i18n";

import { sortOptions } from "../hooks";

export const getLocalizedSortOptionName = (sortOption: string): string => {
  switch (sortOption) {
    case sortOptions.NEWEST:
      return i18n.t("search.newest");

    case sortOptions.OLDEST:
      return i18n.t("search.oldest");

    case sortOptions.BY_RATING:
      return i18n.t("search.byRating");

    default:
      return i18n.t("search.byWords");
  }
};

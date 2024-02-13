import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getNotes } from "modules/notes/NotesSlice";
import { Note } from "modules/notes/types";
import { useAppSelector } from "store/helpers/storeHooks";

export const ALL_TYPE_ID = "ALL_TYPE_ID";
export const ALL_CATEGORY_ID = "ALL_CATEGORY_ID";

export const sortOptions = {
  NEWEST: "Newest",
  OLDEST: "Oldest",
  BY_RATING: "By rating",
  BY_WORDS: "By words",
};

type Props = {
  searchQuery: string;
  activeSortOption: string;
  starredFilter: boolean;
  imagesFilter: boolean;
  onSearch: (filteredNotes: Note[]) => void;
};

export const useSearchNotes = ({
  searchQuery,
  activeSortOption,
  starredFilter,
  imagesFilter,
  onSearch,
}: Props) => {
  const allNotes = useAppSelector(getNotes);

  const [activeTypesIds, setActiveTypesIds] = useState<string[]>([ALL_TYPE_ID]);
  const [activeCategoriesIds, setActiveCategoriesIds] = useState<string[]>([
    ALL_CATEGORY_ID,
  ]);

  const onLabelPress = useCallback(
    (labelId: string, isTypeLabel = true) => {
      const state = isTypeLabel ? activeTypesIds : activeCategoriesIds;
      const setter = isTypeLabel ? setActiveTypesIds : setActiveCategoriesIds;
      const allLabelId = isTypeLabel ? ALL_TYPE_ID : ALL_CATEGORY_ID;

      if (labelId === allLabelId) {
        setter([allLabelId]);

        return;
      }

      if (state.includes(labelId)) {
        setter((prev) => {
          const filteredLabels = prev.filter((item) => item !== labelId);

          if (!filteredLabels.length) return [allLabelId];

          return filteredLabels;
        });

        return;
      }

      if (state.includes(allLabelId)) {
        setter((prev) => [
          ...prev.filter((item) => item !== allLabelId),
          labelId,
        ]);

        return;
      }

      setter((prev) => [...prev, labelId]);
    },
    [activeCategoriesIds, activeTypesIds],
  );

  const searchNotes = useCallback(
    (
      trimmedSearchQuery: string,
      activeTypesIds: string[],
      activeCategoriesIds: string[],
      activeSortOption: string,
      starredFilter: boolean,
      imagesFilter: boolean,
    ) => {
      const filteredNotes = allNotes
        .filter((item) => {
          const titleFilter = item.title
            .toLowerCase()
            .includes(trimmedSearchQuery.toLowerCase());
          const typesFilter =
            activeTypesIds.includes(ALL_TYPE_ID) ||
            (item.type?._id && activeTypesIds.includes(item.type._id));

          const categoriesFilter =
            activeCategoriesIds.includes(ALL_CATEGORY_ID) ||
            item.category.some((categoryItem) =>
              activeCategoriesIds.includes(categoryItem._id),
            );

          const _starredFilter = !starredFilter || item.isStarred;
          const _imagesFilter = !imagesFilter || item.images.length > 0;

          return (
            titleFilter &&
            typesFilter &&
            categoriesFilter &&
            _starredFilter &&
            _imagesFilter
          );
        })
        .slice()
        .sort((a, b) => {
          switch (activeSortOption) {
            case sortOptions.OLDEST:
              return a.startDate - b.startDate;

            case sortOptions.BY_RATING:
              return b.rating - a.rating;

            case sortOptions.BY_WORDS:
              return b.content.length - a.content.length;

            default:
              return b.startDate - a.startDate;
          }
        });

      onSearch(filteredNotes);
    },
    [allNotes, onSearch],
  );

  const searchNotesDebouncer = useMemo(
    () => debounce(searchNotes, 500),
    [searchNotes],
  );

  useEffect(() => {
    const trimmedSearchQuery = searchQuery.trim().toLowerCase();

    searchNotesDebouncer(
      trimmedSearchQuery,
      activeTypesIds,
      activeCategoriesIds,
      activeSortOption,
      starredFilter,
      imagesFilter,
    );
  }, [
    activeCategoriesIds,
    activeSortOption,
    activeTypesIds,
    imagesFilter,
    searchNotesDebouncer,
    searchQuery,
    starredFilter,
  ]);

  return { activeTypesIds, activeCategoriesIds, onLabelPress };
};

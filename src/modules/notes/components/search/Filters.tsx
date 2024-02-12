import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import theme from "theme";

import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Input from "components/Input";
import Typography from "components/Typography";
import {
  getNotes,
  getCustomTypes,
  getCustomCategories,
} from "modules/notes/NotesSlice";
import { Note } from "modules/notes/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { getPluralLabel } from "utils/getPluralLabel";

import NoteSeparator from "../noteItem/NoteSeparator";

import FilterName from "./FilterName";

const ALL_TYPE_ID = "ALL_TYPE_ID";
const ALL_CATEGORY_ID = "ALL_CATEGORY_ID";

const sortOptions = {
  NEWEST: "Newest",
  OLDEST: "Oldest",
  BY_RATING: "By rating",
  BY_WORDS: "By words",
};

type Props = {
  searchedNotes: Note[];
  onSearch: (filteredNotes: Note[]) => void;
};

const Filters = ({ searchedNotes, onSearch }: Props): JSX.Element => {
  const allNotes = useAppSelector(getNotes);

  const types = useAppSelector(getCustomTypes);
  const categories = useAppSelector(getCustomCategories);

  const [searchQuery, setSearchQuery] = useState("");
  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

  const [activeTypesIds, setActiveTypesIds] = useState<string[]>([ALL_TYPE_ID]);
  const [activeCategoriesIds, setActiveCategoriesIds] = useState<string[]>([
    ALL_CATEGORY_ID,
  ]);
  const [activeSortOption, setActiveSortOption] = useState(sortOptions.NEWEST);
  const [starredFilter, setStarredFilter] = useState(false);
  const [imagesFilter, setImagesFilter] = useState(false);

  const onChange = (text: string) => {
    setSearchQuery(text);
  };

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

  const firstNoteDateElement =
    searchedNotes.length > 0 ? (
      <NoteSeparator
        leadingItem={searchedNotes[0]}
        trailingItem={searchedNotes[0]}
        isFirstItem
      />
    ) : undefined;

  const searchCategories = useCallback(() => {
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
  }, [
    allNotes,
    onSearch,
    trimmedSearchQuery,
    activeTypesIds,
    activeCategoriesIds,
    starredFilter,
    imagesFilter,
    activeSortOption,
  ]);

  const searchNotesDebouncer = useMemo(
    () => debounce(searchCategories, 500),
    [searchCategories],
  );

  // TODO: optimize it
  useEffect(() => {
    if (
      !trimmedSearchQuery &&
      !activeTypesIds.length &&
      !activeCategoriesIds.length &&
      !activeSortOption
    )
      return;

    searchNotesDebouncer();
  }, [
    activeCategoriesIds.length,
    activeSortOption,
    activeTypesIds.length,
    searchNotesDebouncer,
    trimmedSearchQuery,
  ]);

  return (
    <>
      <InputContainer>
        <Input
          value={searchQuery}
          placeholder="Enter a note's title"
          isCentered
          bgColor={theme.colors.white}
          labelColor={theme.colors.darkBlueText}
          withAutoFocus
          onChange={onChange}
          minHeight={62}
          paddingHorizontal={50}
          borderRadius={8}
        />
        {trimmedSearchQuery.length > 0 && (
          <ClearIconContainer
            hitSlop={BUTTON_HIT_SLOP}
            onPress={() => setSearchQuery("")}
          >
            <MaterialIcons name="clear" size={18} color={theme.colors.white} />
          </ClearIconContainer>
        )}
      </InputContainer>

      <FilterName label="Types" />
      <LabelsContainer>
        <LabelItemContainer
          active={activeTypesIds.includes(ALL_TYPE_ID)}
          onPress={() => onLabelPress(ALL_TYPE_ID)}
        >
          <Typography color={theme.colors.white}>All</Typography>
        </LabelItemContainer>
        {types.map(({ _id, labelName }) => (
          <LabelItemContainer
            key={_id}
            active={activeTypesIds.includes(_id)}
            onPress={() => onLabelPress(_id)}
          >
            <Typography color={theme.colors.white}>{labelName}</Typography>
          </LabelItemContainer>
        ))}
      </LabelsContainer>

      <FilterName label="Categories" />
      <LabelsContainer>
        <LabelItemContainer
          active={activeCategoriesIds.includes(ALL_CATEGORY_ID)}
          onPress={() => onLabelPress(ALL_CATEGORY_ID, false)}
        >
          <Typography color={theme.colors.white}>All</Typography>
        </LabelItemContainer>

        <LabelItemContainer
          active={starredFilter}
          onPress={() => setStarredFilter((prev) => !prev)}
        >
          <FontAwesome name="star" size={18} color={theme.colors.white} />
        </LabelItemContainer>

        <LabelItemContainer
          active={imagesFilter}
          onPress={() => setImagesFilter((prev) => !prev)}
        >
          <FontAwesome name="image" size={18} color={theme.colors.white} />
        </LabelItemContainer>

        {categories.map(({ _id, labelName }) => (
          <LabelItemContainer
            key={_id}
            active={activeCategoriesIds.includes(_id)}
            onPress={() => onLabelPress(_id, false)}
          >
            <Typography color={theme.colors.white}>{labelName}</Typography>
          </LabelItemContainer>
        ))}
      </LabelsContainer>

      <FilterName label="Sort" />
      <LabelsContainer>
        {Object.values(sortOptions).map((sortOption) => (
          <LabelItemContainer
            key={sortOption}
            active={activeSortOption === sortOption}
            onPress={() => setActiveSortOption(sortOption)}
          >
            <Typography color={theme.colors.white}>{sortOption}</Typography>
          </LabelItemContainer>
        ))}
      </LabelsContainer>

      {searchedNotes.length > 0 && (
        <Typography
          color={theme.colors.darkBlueText}
          fontSize="xl"
          fontWeight="bold"
          paddingTop={10}
          paddingBottom={20}
        >
          {getPluralLabel(searchedNotes.length, "note")} found:
        </Typography>
      )}

      {firstNoteDateElement}
    </>
  );
};

const InputContainer = styled.View`
  margin-bottom: 10px;
`;

const ClearIconContainer = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.cyan500};
  border-radius: 999px;
  position: absolute;
  right: 12px;
  top: 18px;
  z-index: 999999;
`;

const LabelsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
  gap: 6px;
`;

const LabelItemContainer = styled.TouchableOpacity<{ active: boolean }>`
  padding: 4px 12px;
  min-height: 30px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }) =>
    active ? theme.colors.cyan500 : theme.colors.darkBlueText};
`;

export default React.memo(Filters);

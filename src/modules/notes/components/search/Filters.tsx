import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Input from "components/Input";
import Typography from "components/Typography";
import { useNoteLabels } from "modules/customLabels/api/customLabelsSelectors";
import { CustomLabel } from "modules/customLabels/types";
import { Note } from "modules/notes/types";
import styled from "styled-components/native";

import NoteSeparator from "../noteItem/NoteSeparator";

import FilterName from "./FilterName";
import { sortOptions, useSearchNotes } from "./hooks";
import { ALL_CATEGORY_ID, ALL_TYPE_ID } from "./hooks/useSearchNotes";
import { getLocalizedSortOptionName } from "./utils/getLocalizedSortOptionName";

type Props = {
  searchedNotes: Note[];
  isResetTriggered: boolean;
  onSearch: (filteredNotes: Note[]) => void;
};

const Filters = ({
  searchedNotes,
  isResetTriggered,
  onSearch,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { labels } = useNoteLabels();

  const { types, categories } = useMemo(() => {
    const types: CustomLabel[] = [];
    const categories: CustomLabel[] = [];

    labels.forEach((label) => {
      if (label.isCategoryLabel) {
        categories.push(label);
      } else {
        types.push(label);
      }
    });

    return {
      types,
      categories,
    };
  }, [labels]);

  const [searchQuery, setSearchQuery] = useState("");
  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

  const [activeSortOption, setActiveSortOption] = useState(sortOptions.NEWEST);
  const [starredFilter, setStarredFilter] = useState(false);
  const [imagesFilter, setImagesFilter] = useState(false);

  const { activeCategoriesIds, activeTypesIds, onLabelPress, resetLabels } =
    useSearchNotes({
      searchQuery,
      activeSortOption,
      starredFilter,
      imagesFilter,
      onSearch,
    });

  const firstNoteDateElement = useMemo(
    () =>
      searchedNotes.length > 0 ? (
        <NoteSeparator
          leadingItem={searchedNotes[0]}
          trailingItem={searchedNotes[0]}
          isFirstItem
        />
      ) : undefined,
    [searchedNotes],
  );

  const onChange = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    if (!isResetTriggered) return;

    setSearchQuery("");
    setActiveSortOption(sortOptions.NEWEST);
    setStarredFilter(false);
    setImagesFilter(false);
    resetLabels();
  }, [isResetTriggered, resetLabels]);

  return (
    <>
      <InputContainer>
        <Input
          value={searchQuery}
          placeholder={t("search.enterNotesTitle")}
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

      <FilterName label={t("search.types")} />
      <LabelsContainer>
        <LabelItemContainer
          active={activeTypesIds.includes(ALL_TYPE_ID)}
          onPress={() => onLabelPress(ALL_TYPE_ID)}
        >
          <Typography color={theme.colors.white}>{t("search.all")}</Typography>
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

      <FilterName label={t("search.categories")} />
      <LabelsContainer>
        <LabelItemContainer
          active={activeCategoriesIds.includes(ALL_CATEGORY_ID)}
          onPress={() => onLabelPress(ALL_CATEGORY_ID, false)}
        >
          <Typography color={theme.colors.white}>{t("search.all")}</Typography>
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

      <FilterName label={t("search.sort")} />
      <LabelsContainer>
        {Object.values(sortOptions).map((sortOption) => (
          <LabelItemContainer
            key={sortOption}
            active={activeSortOption === sortOption}
            onPress={() => setActiveSortOption(sortOption)}
          >
            <Typography color={theme.colors.white}>
              {getLocalizedSortOptionName(sortOption)}
            </Typography>
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
          {t("search.notesFound", { count: searchedNotes.length })}
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

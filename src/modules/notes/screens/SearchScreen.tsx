import { LinearGradient } from "expo-linear-gradient";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FlashList } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import NotePreview from "../components/noteItem/NotePreview";
import NoteSeparator from "../components/noteItem/NoteSeparator";
import Filters from "../components/search/Filters";
import { getNotes } from "../NotesSlice";
import { Note } from "../types";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 80,
  paddingHorizontal: 20,
};

const ITEMS_PER_PAGE = 10;

const keyExtractor = (item: Note, i: number) => `${i}-${item._id}`;

const SearchScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const allNotes = useAppSelector(getNotes);

  const flashListRef = useRef<FlashList<Note>>(null);

  const [page, setPage] = useState(0);

  const [searchedNotes, setSearchedNotes] = useState<Note[]>(
    allNotes.slice(0, ITEMS_PER_PAGE),
  );
  const [paginatedNotes, setPaginatedNotes] = useState(searchedNotes);

  const [isResetTriggered, setIsResetTriggered] = useState(false);

  const onSearch = useCallback((filteredNotes: Note[]) => {
    setSearchedNotes(filteredNotes);
    setPaginatedNotes(filteredNotes.slice(0, ITEMS_PER_PAGE));
    setPage(0);
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
      <Filters
        searchedNotes={searchedNotes}
        isResetTriggered={isResetTriggered}
        onSearch={onSearch}
      />
    ),
    [onSearch, isResetTriggered, searchedNotes],
  );
  const ListEmptyComponent = useMemo(
    () => (
      <EmptyContainer>
        <Typography
          fontWeight="semibold"
          fontSize="xl"
          paddingTop={10}
          align="center"
        >
          {t("search.noResults")}
        </Typography>
        <Button
          label={t("search.resetFilters")}
          marginTop={20}
          labelProps={{ fontSize: "lg" }}
          bgColor={theme.colors.cyan600}
          onPress={() => {
            setIsResetTriggered(true);

            requestAnimationFrame(() => setIsResetTriggered(false));
          }}
        />
      </EmptyContainer>
    ),
    [t],
  );

  const loadMoreData = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const isAllLoaded = startIndex >= searchedNotes.length;

    if (isAllLoaded) return;

    setPaginatedNotes((prevNotes) => [
      ...prevNotes,
      ...searchedNotes.slice(startIndex, endIndex),
    ]);
    setPage(nextPage);
  }, [searchedNotes, page]);

  useEffect(() => {
    if (paginatedNotes.length === 0 && allNotes.length > 0) {
      setPaginatedNotes(allNotes.slice(0, ITEMS_PER_PAGE));
    }
  }, [allNotes, paginatedNotes.length]);

  // When notes are updated we reset the state
  useEffect(() => {
    setPage(0);
    setPaginatedNotes(allNotes.slice(0, ITEMS_PER_PAGE));
  }, [allNotes]);

  return (
    <>
      <HeaderBar withBackArrow withAddBtn title={t("search.search")} />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <FlashList
          data={searchedNotes}
          renderItem={({ item }) => <NotePreview item={item} />} // Shouldn't be memoized in order to avoid the missed separator on loadMore issue
          onEndReached={loadMoreData}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={NoteSeparator}
          onEndReachedThreshold={0.1}
          estimatedItemSize={300}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          ref={flashListRef}
          bounces={false}
        />
      </SLinearGradient>
    </>
  );
};

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const EmptyContainer = styled.View`
  align-items: center;
`;

export default SearchScreen;

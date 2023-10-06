import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import HeaderBar from "components/HeaderBar";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import AddButton from "../components/AddButton";
import NotePreview from "../components/NotePreview";
import { notesApi } from "../NotesApi";
import { getNotes } from "../NotesSlice";
import { Note } from "../types";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 60,
  paddingHorizontal: 20,
};

const ITEMS_PER_PAGE = 10;

const NotesScreen = (): JSX.Element => {
  const [fetchNotes, { isLoading }] = notesApi.useLazyFetchNotesQuery();

  const allNotes = useAppSelector(getNotes);

  const [page, setPage] = useState(1);

  const [notes, setNotes] = useState(allNotes.slice(0, ITEMS_PER_PAGE));

  const [isLoaded, setIsLoaded] = useState(false);

  const renderItem: ListRenderItem<Note> = useCallback(
    ({ item, index }) => (
      <NotePreview item={item} isLast={index === notes.length - 1} />
    ),
    [notes],
  );

  const loadMoreData = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const isAllLoaded = startIndex >= allNotes.length;

    if (isAllLoaded) return;

    setNotes((prevNotes) => [
      ...prevNotes,
      ...allNotes.slice(startIndex, endIndex),
    ]);
    setPage(nextPage);
  }, [allNotes, page]);

  useEffect(() => {
    if (notes.length === 0 && allNotes.length > 0) {
      setNotes(allNotes.slice(0, ITEMS_PER_PAGE));
    }

    if (!isLoaded) {
      setIsLoaded(true);
      fetchNotes("62b82f38a02731ee158d8ceb", false);
    }
  }, [allNotes, notes.length, isLoaded, fetchNotes]);

  return (
    <>
      <HeaderBar withLogo withLogoutBtn />
      <AddButton />
      {isLoading ? (
        <LoaderContainer>
          <ActivityIndicator size="large" />
        </LoaderContainer>
      ) : (
        <FlashList
          data={notes}
          renderItem={renderItem}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          keyExtractor={(item) => item._id}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        />
      )}
    </>
  );
};

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

export default NotesScreen;

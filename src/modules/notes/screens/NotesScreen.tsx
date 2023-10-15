import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import theme from "theme";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import AddButton from "../components/AddButton";
import NotePreview from "../components/NotePreview";
import { EMPTY_NOTE } from "../data";
import { notesApi } from "../NotesApi";
import { getNotes } from "../NotesSlice";
import { Note } from "../types";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 80,
  paddingHorizontal: 20,
};

const ITEMS_PER_PAGE = 10;

const keyExtractor = (item: Note, i: number) => `${i}-${item._id}`;

const NotesScreen = (): JSX.Element => {
  const [fetchNotes, { isLoading }] = notesApi.useLazyFetchNotesQuery();

  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId);
  const allNotes = useAppSelector(getNotes);

  const [page, setPage] = useState(0);

  const [notes, setNotes] = useState(allNotes.slice(0, ITEMS_PER_PAGE));

  const [isLoaded, setIsLoaded] = useState(false);

  const renderItem: ListRenderItem<Note> = useCallback(
    ({ item, index }) => (
      <NotePreview item={item} isLast={index === notes.length - 1} />
    ),
    [notes],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <>
        <Typography
          fontWeight="semibold"
          fontSize="xl"
          align="center"
          color={theme.colors.darkBlueText}
        >
          You don't have any notes yet
        </Typography>
        <Button
          label="Add a note"
          marginTop={20}
          labelProps={{ fontSize: "xl", fontWeight: "bold" }}
          onPress={() =>
            navigation.navigate(Routes.EDIT_NOTE, {
              item: EMPTY_NOTE,
              isNewNote: true,
            })
          }
          bgColor={theme.colors.cyan600}
        />
      </>
    ),
    [navigation],
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

    if (!isLoaded && userId) {
      setIsLoaded(true);
      fetchNotes(userId, false);
    }
  }, [allNotes, notes.length, userId, isLoaded, fetchNotes]);

  // When notes are updated we reset the state
  useEffect(() => {
    setPage(0);
    setNotes(allNotes.slice(0, ITEMS_PER_PAGE));
  }, [allNotes]);

  return (
    <>
      <HeaderBar withLogo withLogoutBtn />
      <AddButton />
      {isLoading ? (
        <LoaderContainer>
          <ActivityIndicator size="large" color={theme.colors.cyan600} />
        </LoaderContainer>
      ) : (
        <FlashList
          data={notes}
          renderItem={renderItem}
          onEndReached={loadMoreData}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
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

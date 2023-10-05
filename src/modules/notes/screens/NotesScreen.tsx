import { isEmpty } from "ramda";
import React, { FC, useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import HeaderBar from "components/HeaderBar";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import NotePreview from "../components/NotePreview";
import { notesApi } from "../NotesApi";
import { getNotes } from "../NotesSlice";
import { Note } from "../types";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 60,
  paddingHorizontal: 20,
};

const NotesScreen: FC = () => {
  const [fetchNotes, { isLoading }] = notesApi.useLazyFetchNotesQuery();

  const notes = useAppSelector(getNotes).slice(0, 10);

  const renderItem: ListRenderItem<Note> = useCallback(
    ({ item, index }) => (
      <NotePreview item={item} isLast={index === notes.length - 1} />
    ),
    [notes],
  );

  useEffect(() => {
    if (isEmpty(notes)) {
      fetchNotes("62b82f38a02731ee158d8ceb");
    }
  }, [notes, fetchNotes]);

  return (
    <>
      <HeaderBar withLogo withLogoutBtn />
      {isLoading ? (
        <LoaderContainer>
          <ActivityIndicator size="large" />
        </LoaderContainer>
      ) : (
        <FlashList
          data={notes}
          renderItem={renderItem}
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

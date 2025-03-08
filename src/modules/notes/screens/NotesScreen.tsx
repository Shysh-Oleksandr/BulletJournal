import { LinearGradient } from "expo-linear-gradient";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl } from "react-native";
import theme from "theme";

import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import LogoutBtn from "components/HeaderBar/components/LogoutBtn";
import Typography from "components/Typography";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
  SMALL_BUTTON_HIT_SLOP,
} from "modules/app/constants";
import { CustomUserEvents } from "modules/app/types";
import { useAuth } from "modules/auth/AuthContext";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { logUserEvent } from "utils/logUserEvent";

import { notesApi } from "../api/notesApi";
import AddButton from "../components/AddButton";
import NotePreview from "../components/noteItem/NotePreview";
import NoteSeparator from "../components/noteItem/NoteSeparator";
import { Note } from "../types";
import { getEmptyNote } from "../util/getEmptyNote";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 80,
  paddingHorizontal: 16,
};

const ITEMS_PER_PAGE = 10;

const keyExtractor = (item: Note, i: number) => `${i}-${item._id}`;

const NotesScreen = (): JSX.Element => {
  const { t } = useTranslation();

  const userId = useAuth().userId;

  const {
    data: allNotes = [],
    isLoading: isNotesLoading,
    refetch: refetchNotes,
  } = notesApi.useNotesQuery(userId);

  const { isLoading: isLabelsLoading, refetch: refetchLabels } =
    notesApi.useLabelsQuery(userId);

  const navigation = useAppNavigation();

  const flashListRef = useRef<FlashList<Note>>(null);

  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const [page, setPage] = useState(0);

  const [notes, setNotes] = useState(allNotes.slice(0, ITEMS_PER_PAGE));

  const isLoading = isNotesLoading || isLabelsLoading;

  const ListEmptyComponent = useMemo(
    () => (
      <>
        <Typography fontWeight="semibold" fontSize="xl" align="center">
          {t("note.noNotesInfo")}
        </Typography>
        <Button
          label={t("note.addNote")}
          marginTop={20}
          labelProps={{ fontSize: "xl", fontWeight: "bold" }}
          onPress={() =>
            navigation.navigate(Routes.EDIT_NOTE, {
              item: getEmptyNote(),
              isNewNote: true,
            })
          }
          bgColor={theme.colors.cyan600}
        />
      </>
    ),
    [navigation, t],
  );

  const ListHeaderComponent = useMemo(
    () =>
      notes.length > 0 ? (
        <NoteSeparator
          leadingItem={notes[0]}
          trailingItem={notes[0]}
          isFirstItem
        />
      ) : undefined,
    [notes],
  );

  const scrollToTop = useCallback(() => {
    logUserEvent(CustomUserEvents.SCROLL_TO_TOP);
    flashListRef?.current?.scrollToOffset({ offset: 0, animated: true });
  }, [flashListRef]);

  // TODO: implement real pagination
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

  const handleManualRefresh = async () => {
    setIsManualRefresh(true);
    await refetchNotes();
    await refetchLabels();
    setIsManualRefresh(false);
  };

  // // When notes are updated we reset the state
  useEffect(() => {
    if (allNotes.length === 0) return;

    setPage(0);
    setNotes(allNotes.slice(0, ITEMS_PER_PAGE));
  }, [allNotes]);

  return (
    <>
      <HeaderBar
        withLogo
        trailingContent={(textColor) => (
          <>
            <SearchButtonContainer
              onPress={() => navigation.navigate(Routes.SEARCH)}
              hitSlop={SMALL_BUTTON_HIT_SLOP}
            >
              <Ionicons name="search" size={26} color={textColor} />
            </SearchButtonContainer>
            <LogoutBtn />
          </>
        )}
        onLogoPress={scrollToTop}
      />
      <AddButton />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        {isLoading ? (
          <LoaderContainer>
            <ActivityIndicator size="large" color={theme.colors.cyan600} />
          </LoaderContainer>
        ) : (
          <FlashList
            data={notes}
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
            refreshControl={
              <RefreshControl
                colors={[theme.colors.cyan600]}
                refreshing={isManualRefresh}
                onRefresh={handleManualRefresh}
              />
            }
          />
        )}
      </SLinearGradient>
    </>
  );
};

const LoaderContainer = styled.View`
  padding-top: 40px;
  justify-content: center;
`;

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

const SearchButtonContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export default NotesScreen;

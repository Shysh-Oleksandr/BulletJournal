import { isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { FlashList } from "@shopify/flash-list";
import Button from "components/Button";
import HeaderBar from "components/HeaderBar";
import AddItemButton from "components/HeaderBar/components/AddItemButton";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import NotePreview from "modules/notes/components/noteItem/NotePreview";
import NoteSeparator from "modules/notes/components/noteItem/NoteSeparator";
import { getNotes } from "modules/notes/NotesSlice";
import { Note } from "modules/notes/types";
import { getEmptyNote } from "modules/notes/util/getEmptyNote";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";

import Calendar from "../components/Calendar";

const contentContainerStyle = {
  paddingTop: 30,
  paddingBottom: 80,
  paddingHorizontal: 16,
};

const keyExtractor = (item: Note, i: number) => `${i}-${item._id}`;

const CalendarScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const allNotes = useAppSelector(getNotes);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredNotes = useMemo(
    () => allNotes.filter((note) => isSameDay(note.startDate, selectedDate)),
    [allNotes, selectedDate],
  );

  const ListHeaderComponent = useMemo(
    () => (
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    ),
    [selectedDate],
  );

  const navigateToNewNote = useCallback(() => {
    const date = new Date(selectedDate);
    const now = new Date();

    date.setHours(now.getHours(), now.getMinutes(), 0, 0);

    navigation.navigate(Routes.EDIT_NOTE, {
      item: getEmptyNote(),
      date: date.getTime(),
      isNewNote: true,
    });
  }, [navigation, selectedDate]);

  const ListEmptyComponent = useMemo(
    () => (
      <EmptyContainer>
        <Button
          label={t("note.addNote")}
          marginTop={10}
          labelProps={{ fontSize: "xl", fontWeight: "bold" }}
          onPress={navigateToNewNote}
          bgColor={theme.colors.cyan600}
        />
      </EmptyContainer>
    ),
    [navigateToNewNote, t],
  );

  return (
    <>
      <HeaderBar
        title={t("calendar.calendar")}
        trailingContent={(textColor) => (
          <AddItemButton textColor={textColor} onPress={navigateToNewNote} />
        )}
      />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <FlashList
          data={filteredNotes}
          renderItem={({ item }) => <NotePreview item={item} />} // Shouldn't be memoized in order to avoid the missed separator on loadMore issue
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={NoteSeparator}
          estimatedItemSize={300}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
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

export default CalendarScreen;

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import theme from "theme";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { useAllNotes } from "modules/notes/api/notesSelectors";
import { Note } from "modules/notes/types";
import { getEmptyNote } from "modules/notes/util/getEmptyNote";
import styled from "styled-components/native";

const LEFT_ICON = (
  <MaterialCommunityIcons
    name="chevron-double-left"
    size={20}
    color={theme.colors.darkBlueText}
  />
);
const RIGHT_ICON = (
  <MaterialCommunityIcons
    name="chevron-double-right"
    size={20}
    color={theme.colors.darkBlueText}
  />
);

type Props = {
  noteId: string;
};

const NeighboringNotesLinks = ({ noteId }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const navigation = useAppNavigation();

  const { notes: allNotes } = useAllNotes();

  const { prevNote, nextNote } = useMemo(() => {
    const index = allNotes.findIndex((note) => note._id === noteId);

    const prevNote = index === 0 ? null : allNotes[index - 1];
    const nextNote = index === allNotes.length - 1 ? null : allNotes[index + 1];

    return { prevNote, nextNote };
  }, [allNotes, noteId]);

  const navigateToNote = useCallback(
    (item: Note | null) => {
      if (!item) {
        navigation.replace(Routes.EDIT_NOTE, {
          item: getEmptyNote(),
          isNewNote: true,
        });

        return;
      }

      navigation.replace(Routes.EDIT_NOTE, { item });
    },
    [navigation],
  );

  if (!prevNote && !nextNote) return null;

  return (
    <Container>
      <PrevNoteContainer
        onPress={() => navigateToNote(prevNote)}
        hitSlop={BUTTON_HIT_SLOP}
      >
        <LabelContainer>
          {LEFT_ICON}
          <Typography fontWeight="semibold" uppercase fontSize="sm">
            {t(prevNote ? "note.previous" : "note.create")}
          </Typography>
        </LabelContainer>
        <Typography fontSize="xs" numberOfLines={2}>
          {prevNote ? prevNote.title : t("note.newNote")}
        </Typography>
      </PrevNoteContainer>
      <VerticalDivider />
      <NextNoteContainer
        onPress={() => navigateToNote(nextNote)}
        disabled={!nextNote}
        hitSlop={BUTTON_HIT_SLOP}
      >
        {nextNote && (
          <>
            <LabelContainer isNext>
              <Typography
                align="right"
                fontWeight="semibold"
                uppercase
                fontSize="sm"
              >
                {t("note.next")}
              </Typography>
              {RIGHT_ICON}
            </LabelContainer>
            <Typography fontSize="xs" align="right" numberOfLines={2}>
              {nextNote.title}
            </Typography>
          </>
        )}
      </NextNoteContainer>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
  padding: 10px 0 8px;
  border-top-width: 2px;
  border-color: ${theme.colors.cyan200};
`;

const VerticalDivider = styled.View`
  height: 100%;
  width: 2px;
  background-color: ${theme.colors.cyan200};
  margin: 0 4px;
`;

const PrevNoteContainer = styled.TouchableOpacity`
  flex: 1;
`;

const NextNoteContainer = styled.TouchableOpacity`
  flex: 1;
`;

const LabelContainer = styled.View<{ isNext?: boolean }>`
  flex-direction: row;
  align-items: center;
  ${({ isNext }) => isNext && "justify-content: flex-end;"}
`;

export default React.memo(NeighboringNotesLinks);

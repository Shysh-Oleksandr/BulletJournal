import React, { useMemo } from "react";
import theme from "theme";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BUTTON_HIT_SLOP } from "components/HeaderBar";
import Typography from "components/Typography";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { Routes } from "modules/navigation/types";
import { getNotes } from "modules/notes/NotesSlice";
import { Note } from "modules/notes/types";
import { useAppSelector } from "store/helpers/storeHooks";
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
  index: number;
};

const NeighboringNotesLinks = ({ index }: Props): JSX.Element | null => {
  const navigation = useAppNavigation();

  const allNotes = useAppSelector(getNotes);

  const { prevNote, nextNote } = useMemo(() => {
    const prevNote = index === 0 ? null : allNotes[index - 1];
    const nextNote = index === allNotes.length - 1 ? null : allNotes[index + 1];

    return { prevNote, nextNote };
  }, [allNotes, index]);

  if (!prevNote && !nextNote) return null;

  const navigateToNote = (item: Note | null, index: number) => {
    if (!item) return;

    navigation.replace(Routes.EDIT_NOTE, { item, index });
  };

  return (
    <Container>
      <PrevNoteContainer
        onPress={() => navigateToNote(prevNote, index - 1)}
        disabled={!prevNote}
        hitSlop={BUTTON_HIT_SLOP}
      >
        {prevNote && (
          <>
            <LabelContainer>
              {LEFT_ICON}
              <Typography
                fontWeight="semibold"
                uppercase
                fontSize="sm"
                color={theme.colors.darkBlueText}
              >
                Previous
              </Typography>
            </LabelContainer>
            <Typography
              fontSize="xs"
              color={theme.colors.darkBlueText}
              numberOfLines={2}
            >
              {prevNote.title}
            </Typography>
          </>
        )}
      </PrevNoteContainer>
      <VerticalDivider />
      <NextNoteContainer
        onPress={() => navigateToNote(nextNote, index + 1)}
        disabled={!nextNote}
        hitSlop={BUTTON_HIT_SLOP}
      >
        {nextNote && (
          <>
            <LabelContainer isNext>
              <Typography
                align="right"
                fontWeight="semibold"
                color={theme.colors.darkBlueText}
                uppercase
                fontSize="sm"
              >
                Next
              </Typography>
              {RIGHT_ICON}
            </LabelContainer>
            <Typography
              fontSize="xs"
              align="right"
              color={theme.colors.darkBlueText}
              numberOfLines={2}
            >
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
  align-items: center;
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

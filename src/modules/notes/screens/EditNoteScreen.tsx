import isEqual from "lodash.isequal";
import { isNil } from "ramda";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Alert, GestureResponderEvent } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import logging from "config/logging";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { getContentWords } from "utils/getContentWords";
import { getPluralLabel } from "utils/getPluralLabel";
import { logUserEvent } from "utils/logUserEvent";

import CategoriesSelector from "../components/labels/CategoriesSelector";
import TypeSelector from "../components/labels/TypeSelector";
import ColorPicker from "../components/noteForm/ColorPicker";
import DatePicker from "../components/noteForm/DatePicker";
import ImportanceInput from "../components/noteForm/ImportanceInput";
import LockButton from "../components/noteForm/LockButton";
import NeighboringNotesLinks from "../components/noteForm/NeighboringNotesLinks";
import NoteActionButtons from "../components/noteForm/NoteActionButtons";
import SavingStatusLabel from "../components/noteForm/SavingStatusLabel";
import StarButton from "../components/noteForm/StarButton";
import TextEditor from "../components/noteForm/TextEditor";
import TitleInput from "../components/noteForm/TitleInput";
import NoteBody from "../components/noteItem/NoteBody";
import { notesApi } from "../NotesApi";
import { getLabels } from "../NotesSlice";
import { Note, UpdateNoteRequest } from "../types";
import getAllChildrenIds from "../util/getAllChildrenIds";
import removeMarkdown from "../util/removeMarkdown";

const contentContainerStyle = {
  paddingHorizontal: 20,
  paddingBottom: 70,
};

const EditNoteScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_NOTE>;
}> = ({ route }) => {
  const [updateNote] = notesApi.useUpdateNoteMutation();
  const [createNote] = notesApi.useCreateNoteMutation();
  const [deleteNote] = notesApi.useDeleteNoteMutation();

  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId);
  const allLabels = useAppSelector(getLabels);

  const { item: initialNote, index, isNewNote } = route.params;

  const shouldDisplayNeighboringNotes = !isNil(index);

  const {
    _id,
    title,
    content,
    color,
    type,
    category,
    rating,
    startDate,
    isStarred: isInitiallyStarred,
    isLocked: isInitiallyLocked,
  } = initialNote;

  const defaultNoteType = useMemo(
    () =>
      allLabels.find(
        (label) =>
          !label.isCategoryLabel &&
          (isNewNote ? label.labelName === "Note" : label._id === type?._id),
      )?._id ?? null,
    [allLabels, isNewNote, type?._id],
  );

  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentStartDate, setCurrentStartDate] = useState(startDate);
  const [currentImportance, setCurrentImportance] = useState(rating);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentTypeId, setCurrentTypeId] = useState<string | null>(
    defaultNoteType,
  );
  const [currentCategoriesIds, setCurrentCategoriesIds] = useState<string[]>(
    category.map((item) => item._id),
  );
  const [contentHTML, setContentHTML] = useState(content);
  const [isStarred, setIsStarred] = useState(!!isInitiallyStarred);
  const [isLocked, setIsLocked] = useState(!!isInitiallyLocked);

  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [isChildrenIdsSet, setIsChildrenIdsSet] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const richTextRef = useRef<RichEditor | null>(null);

  const wordsCount = useMemo(
    () => getContentWords(removeMarkdown(contentHTML)),
    [contentHTML],
  );

  const currentType = useMemo(
    () =>
      allLabels.find(
        (label) => !label.isCategoryLabel && label._id === currentTypeId,
      ) ?? null,
    [currentTypeId, allLabels],
  );

  const currentCategories = useMemo(
    () =>
      allLabels.filter(
        (label) =>
          label.isCategoryLabel && currentCategoriesIds.includes(label._id),
      ),
    [allLabels, currentCategoriesIds],
  );

  const currentNote: Note = {
    ...initialNote,
    author: userId ?? "",
    title: currentTitle.trim(),
    content: contentHTML.trim(),
    color: currentColor,
    startDate: currentStartDate,
    rating: currentImportance,
    type: currentType,
    category: currentCategories,
    isStarred,
    isLocked,
  };

  const [savedNote, setSavedNote] = useState(currentNote);

  const hasChanges = !isEqual(savedNote, currentNote);

  const hasChangesIfIgnoreLocked = !isEqual(
    { ...savedNote, isLocked: false },
    { ...currentNote, isLocked: false },
  );

  const saveNoteHandler = async (shouldLock?: boolean, withAlert = true) => {
    if (!userId) {
      logging.error("The user doesn't have an id");

      return;
    }

    logUserEvent(
      isNewNote ? CustomUserEvents.CREATE_NOTE : CustomUserEvents.SAVE_NOTE,
      currentNote._id ? { noteId: currentNote._id } : undefined,
    );
    addCrashlyticsLog(
      `User tries to ${isNewNote ? "create" : "update"} a note`,
    );

    setIsSaving(true);

    setSavedNote({
      ...currentNote,
      isLocked: shouldLock ?? currentNote.isLocked,
    });

    const updateNoteData: UpdateNoteRequest = {
      ...currentNote,
      title: currentNote.title || "Note",
      type: currentTypeId,
      category: currentCategoriesIds,
      isLocked: shouldLock ?? currentNote.isLocked,
    };

    try {
      if (isNewNote) {
        await createNote(updateNoteData);

        if (withAlert) {
          navigation.replace(Routes.EDIT_NOTE, { item: currentNote });
        }
      } else {
        await updateNote(updateNoteData);
      }

      if (withAlert) {
        Alert.alert(
          "Success",
          `The note is ${isNewNote ? "created" : "updated"}`,
        );
      }
    } catch (error) {
      logging.error(error);
      addCrashlyticsLog(error as string);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNoteHandler = useCallback(async () => {
    if (!_id) return;

    Alert.alert(
      "Are you sure you want to delete this note?",
      "It will delete the note permanently. This action cannot be undone",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              logUserEvent(CustomUserEvents.DELETE_NOTE, { noteId: _id });
              addCrashlyticsLog(`User tries to delete the note ${_id}`);
              setIsDeleting(true);
              await deleteNote(_id);
              Alert.alert("Success", "The note is deleted");
              navigation.navigate(Routes.NOTES);
            } catch (error) {
              logging.error(error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }, [_id, deleteNote, navigation]);

  const onStartShouldSetResponder = useCallback(
    (evt: GestureResponderEvent) => {
      evt.persist();
      if (childrenIds?.length) {
        if (childrenIds.includes(+evt.nativeEvent.target)) {
          return false;
        }

        richTextRef.current?.dismissKeyboard();

        return false;
      }

      return false;
    },
    [childrenIds],
  );

  const onBackPress = () => {
    if (!hasChanges) return navigation.goBack();

    Alert.alert("You have unsaved changes", "Do you want to save them?", [
      { text: "Cancel", isPreferred: true },
      { text: "No", onPress: navigation.goBack },
      {
        text: "Yes",
        onPress: () => {
          saveNoteHandler(undefined, false);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Wrapper onStartShouldSetResponder={onStartShouldSetResponder}>
      <HeaderBar
        withBackArrow
        title={`${isNewNote ? "Create" : "Edit"} note`}
        onBackArrowPress={onBackPress}
      />
      <SScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={contentContainerStyle}
      >
        <HeaderSection>
          <ButtonGroup>
            <StarButton
              isStarred={isStarred}
              isDisabled={isLocked}
              setIsStarred={setIsStarred}
            />
            {!isNewNote && (
              <LockButton
                isLocked={isLocked}
                hasChanges={
                  hasChangesIfIgnoreLocked || (!isLocked && !savedNote.isLocked)
                }
                setIsLocked={setIsLocked}
                saveNoteHandler={saveNoteHandler}
              />
            )}
          </ButtonGroup>
          <SavingStatusLabel
            isSaving={isSaving}
            isLocked={isLocked}
            hasChanges={hasChanges}
          />
        </HeaderSection>
        <StyledDropShadow distance={10} offset={[0, 5]} startColor="#00000010">
          <Container
            isLocked={isLocked}
            shouldDisplayNeighboringNotes={shouldDisplayNeighboringNotes}
          >
            <FormContentContainer pointerEvents={isLocked ? "none" : "auto"}>
              <TitleInput
                currentTitle={currentTitle}
                setCurrentTitle={setCurrentTitle}
              />
              <DatePicker
                currentStartDate={currentStartDate}
                setCurrentStartDate={setCurrentStartDate}
              />
              <Section>
                <WordsContainer>
                  <Typography fontSize="lg">
                    {getPluralLabel(wordsCount, "word")}
                  </Typography>
                </WordsContainer>
                <InputGroup>
                  <ImportanceInput
                    currentImportance={currentImportance}
                    setCurrentImportance={setCurrentImportance}
                  />
                  <ColorPicker
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                  />
                </InputGroup>
              </Section>
              <TypeSelector
                currentTypeId={currentTypeId}
                currentColor={currentColor}
                setCurrentTypeId={setCurrentTypeId}
                setCurrentColor={setCurrentColor}
              />
              <CategoriesSelector
                currentCategoriesIds={currentCategoriesIds}
                currentColor={currentColor}
                setCurrentCategoriesIds={setCurrentCategoriesIds}
                setCurrentColor={setCurrentColor}
              />
              <TextEditor
                initialContentHtml={content}
                richTextRef={richTextRef}
                containerRef={(component) => {
                  if (component && !isChildrenIdsSet) {
                    setChildrenIds(getAllChildrenIds(component));
                    setIsChildrenIdsSet(true);
                  }
                }}
                setContentHTML={setContentHTML}
              />
              <NoteActionButtons
                isSaving={isSaving}
                hasNoChanges={!hasChanges || currentTitle.trim() === ""}
                isDeleting={isDeleting}
                isNewNote={!!isNewNote}
                isLocked={isLocked}
                saveNote={saveNoteHandler}
                deleteNote={deleteNoteHandler}
              />
            </FormContentContainer>
            {shouldDisplayNeighboringNotes && (
              <NeighboringNotesLinks index={index} />
            )}
          </Container>
        </StyledDropShadow>
        <Typography fontSize="lg" paddingBottom={8}>
          Preview
        </Typography>
        <NoteBody
          {...route.params.item}
          title={currentTitle}
          rating={currentImportance}
          color={currentColor}
          type={currentType}
          category={currentCategories}
          content={contentHTML}
          isStarred={isStarred}
          startDate={currentStartDate}
        />
      </SScrollView>
    </Wrapper>
  );
};

const SScrollView = styled.ScrollView``;

const Wrapper = styled.View`
  flex: 1;
`;

const Container = styled.View<{
  isLocked: boolean;
  shouldDisplayNeighboringNotes: boolean;
}>`
  padding: 10px 16px
    ${({ shouldDisplayNeighboringNotes }) =>
      shouldDisplayNeighboringNotes ? 8 : 30}px;
  align-center: center;
  background-color: ${theme.colors.white};
  border-radius: 6px;
  margin-bottom: 20px;
  ${({ isLocked }) => isLocked && `border: 1px solid ${theme.colors.cyan600};`}
`;

const StyledDropShadow = styled(Shadow)`
  width: 100%;
`;

const FormContentContainer = styled.View``;

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: space-between;
  width: 100%;
  padding-vertical: 4px;
  border-bottom-width: 2px;
  border-color: ${theme.colors.cyan200};
`;

const HeaderSection = styled.View`
  margin-top: 25px;
  flex-direction: row;
  align-center: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px 4px;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  align-center: center;
`;

const InputGroup = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: space-between;
  width: 50%;
  margin-right: 40px;
`;

const WordsContainer = styled.View`
  padding-top: 8px;
`;

export default EditNoteScreen;

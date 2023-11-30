import { LinearGradient } from "expo-linear-gradient";
import isEqual from "lodash.isequal";
import { isNil } from "ramda";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GestureResponderEvent, ScrollView } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import Toast from "react-native-toast-message";
import theme from "theme";

import { EventArg, RouteProp } from "@react-navigation/native";
import ConfirmAlert from "components/ConfirmAlert";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import logging from "config/logging";
import {
  BG_GRADIENT_COLORS,
  BG_GRADIENT_LOCATIONS,
} from "modules/app/constants";
import { CustomUserEvents } from "modules/app/types";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { addCrashlyticsLog } from "utils/addCrashlyticsLog";
import { alertError } from "utils/alertMessages";
import { logUserEvent } from "utils/logUserEvent";

import CategoriesSelector from "../components/labels/CategoriesSelector";
import TypeSelector from "../components/labels/TypeSelector";
import ColorPicker from "../components/noteForm/ColorPicker";
import DatePicker from "../components/noteForm/DatePicker";
import ImagePicker from "../components/noteForm/ImagePicker";
import ImagesSection from "../components/noteForm/ImagesSection";
import ImportanceInput from "../components/noteForm/ImportanceInput";
import LockButton from "../components/noteForm/LockButton";
import NeighboringNotesLinks from "../components/noteForm/NeighboringNotesLinks";
import NoteActionButtons from "../components/noteForm/NoteActionButtons";
import SavingStatusLabel from "../components/noteForm/SavingStatusLabel";
import StarButton from "../components/noteForm/StarButton";
import TextEditor from "../components/noteForm/TextEditor";
import TitleInput from "../components/noteForm/TitleInput";
import WordsCountLabel from "../components/noteForm/WordsCountLabel";
import NoteBody from "../components/noteItem/NoteBody";
import { useHandleImagesOnSave } from "../hooks/useHandleImagesOnSave";
import { deleteImagesFromS3 } from "../modules/s3";
import { notesApi } from "../NotesApi";
import { getLabels } from "../NotesSlice";
import { Note, UpdateNoteRequest } from "../types";
import { cleanHtml } from "../util/cleanHtml";
import getAllChildrenIds from "../util/getAllChildrenIds";

const contentContainerStyle = {
  paddingHorizontal: 20,
  paddingBottom: 70,
};

type NavigationAction = Readonly<{
  type: string;
  payload?: object | undefined;
  source?: string | undefined;
  target?: string | undefined;
}>;

type BeforeRemoveEvent = EventArg<
  "beforeRemove",
  true,
  {
    action: NavigationAction;
  }
>;

const EditNoteScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_NOTE>;
}> = ({ route }) => {
  const [updateNote] = notesApi.useUpdateNoteMutation();
  const [createNote] = notesApi.useCreateNoteMutation();
  const [deleteNote] = notesApi.useDeleteNoteMutation();

  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId) ?? "";
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
  const [currentTypeId, setCurrentTypeId] = useState(defaultNoteType);
  const [currentCategoriesIds, setCurrentCategoriesIds] = useState(
    category.map((item) => item._id),
  );
  const [currentImages, setCurrentImages] = useState(initialNote.images);
  const [contentHTML, setContentHTML] = useState(content);
  const [isStarred, setIsStarred] = useState(!!isInitiallyStarred);
  const [isLocked, setIsLocked] = useState(!!isInitiallyLocked);

  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [isChildrenIdsSet, setIsChildrenIdsSet] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isLeaveDialogVisible, setIsLeaveDialogVisible] = useState(false);
  const [leaveNavigationAction, setLeaveNavigationAction] =
    useState<NavigationAction | null>(null);

  const richTextRef = useRef<RichEditor | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const cleanedHtml = useMemo(() => cleanHtml(contentHTML), [contentHTML]);

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
    author: userId,
    title: currentTitle.trim(),
    content: cleanedHtml.trim(),
    color: currentColor,
    startDate: currentStartDate,
    rating: currentImportance,
    type: currentType,
    category: currentCategories,
    images: currentImages,
    isStarred,
    isLocked,
  };

  const [savedNote, setSavedNote] = useState(currentNote);

  const hasChanges = !isEqual(savedNote, currentNote);

  const hasChangesIfIgnoreLocked = !isEqual(
    { ...savedNote, isLocked: false },
    { ...currentNote, isLocked: false },
  );

  const handleImages = useHandleImagesOnSave(currentImages, savedNote);

  const saveNoteHandler = async (shouldLock?: boolean, withAlert = true) => {
    if (!userId) {
      logging.error("The user doesn't have an id");

      return;
    }

    setIsSaving(true);

    logUserEvent(
      isNewNote ? CustomUserEvents.CREATE_NOTE : CustomUserEvents.SAVE_NOTE,
      currentNote._id ? { noteId: currentNote._id } : undefined,
    );
    addCrashlyticsLog(
      `User tries to ${isNewNote ? "create" : "update"} a note`,
    );

    const newImages = await handleImages();

    setCurrentImages(newImages);

    const newNote = {
      ...currentNote,
      isLocked: shouldLock ?? currentNote.isLocked,
      images: newImages,
    };

    setSavedNote(newNote);

    const updateNoteData: UpdateNoteRequest = {
      ...currentNote,
      title: currentNote.title || "Note",
      type: currentTypeId,
      category: currentCategoriesIds,
      isLocked: shouldLock ?? currentNote.isLocked,
      images: newImages.map((image) => image._id),
    };

    try {
      if (isNewNote) {
        const response = await createNote(updateNoteData).unwrap();

        if (withAlert && response.note) {
          navigation.replace(Routes.EDIT_NOTE, {
            item: { ...newNote, _id: response.note._id },
            //  TODO: Pass index and fetch notes manually
          });
        }
      } else {
        await updateNote(updateNoteData);
      }

      if (withAlert) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `The note is ${isNewNote ? "created" : "updated"}`,
        });
      }
    } catch (error) {
      logging.error(error);
      alertError();
      addCrashlyticsLog(error as string);
    } finally {
      // The save btn doesn't change its state without using timeout(for some reason)
      setTimeout(() => {
        setIsSaving(false);
      }, 100);
    }
  };

  const deleteNoteHandler = useCallback(async () => {
    if (!_id) return;

    try {
      logUserEvent(CustomUserEvents.DELETE_NOTE, { noteId: _id });
      addCrashlyticsLog(`User tries to delete the note ${_id}`);
      setIsDeleting(true);
      await deleteNote(_id);

      const imagesUrlsToDelete = currentImages
        .map((image) => image.url)
        .filter((image) => !image.startsWith("file"));

      await deleteImagesFromS3(imagesUrlsToDelete);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "The note is deleted",
      });

      setTimeout(() => {
        navigation.replace(Routes.NOTES);
      }, 1000);
    } catch (error) {
      logging.error(error);
      alertError();
    } finally {
      setIsDeleting(false);
    }

    // "It will delete the note permanently. This action cannot be undone",
  }, [_id, currentImages, deleteNote, navigation]);

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

  useEffect(() => {
    const callback = (e: BeforeRemoveEvent) => {
      if (!hasChanges || isLeaveDialogVisible) {
        return;
      }

      e.preventDefault();

      setIsLeaveDialogVisible(true);
      setLeaveNavigationAction(e.data.action);
    };

    navigation.addListener("beforeRemove", callback);

    return () => {
      navigation.removeListener("beforeRemove", callback);
    };
  }, [navigation, hasChanges, isLeaveDialogVisible]);

  return (
    <Wrapper onStartShouldSetResponder={onStartShouldSetResponder}>
      <HeaderBar
        title={`${isNewNote ? "Create" : "Edit"} note`}
        onBackArrowPress={navigation.goBack}
        withAddBtn={!isNewNote}
        withBackArrow
      />
      <SLinearGradient
        locations={BG_GRADIENT_LOCATIONS}
        colors={BG_GRADIENT_COLORS}
      >
        <SScrollView
          ref={scrollViewRef}
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
                    hasChangesIfIgnoreLocked ||
                    (!isLocked && !savedNote.isLocked)
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
          <Container
            isLocked={isLocked}
            shouldDisplayNeighboringNotes={shouldDisplayNeighboringNotes}
          >
            <FormContentContainer pointerEvents={isLocked ? "none" : "auto"}>
              <TitleInput
                currentTitle={currentTitle}
                isNewNote={!!isNewNote}
                setCurrentTitle={setCurrentTitle}
              />
              <DatePicker
                currentStartDate={currentStartDate}
                setCurrentStartDate={setCurrentStartDate}
              />
              <Section>
                <WordsCountLabel contentHTML={cleanedHtml} />
                <ImagePicker
                  noteId={currentNote._id}
                  setCurrentImages={setCurrentImages}
                />
                <ImportanceInput
                  currentImportance={currentImportance}
                  setCurrentImportance={setCurrentImportance}
                />
                <ColorPicker
                  currentColor={currentColor}
                  setCurrentColor={setCurrentColor}
                />
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
                scrollViewRef={scrollViewRef}
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
                deleteNote={() => setIsDeleteDialogVisible(true)}
              />
            </FormContentContainer>
            <ImagesSection
              currentImages={currentImages}
              isLocked={isLocked}
              setCurrentImages={setCurrentImages}
            />
            {shouldDisplayNeighboringNotes && (
              <NeighboringNotesLinks index={index} />
            )}
          </Container>
          <Typography fontSize="lg" paddingBottom={8}>
            Preview
          </Typography>
          <NoteBody
            title={currentTitle}
            rating={currentImportance}
            color={currentColor}
            type={currentType}
            category={currentCategories}
            content={cleanedHtml}
            isStarred={isStarred}
            startDate={currentStartDate}
            images={currentImages}
          />
        </SScrollView>
      </SLinearGradient>
      <ConfirmAlert
        message="Are you sure you want to delete this note?"
        isDeletion
        isDialogVisible={isDeleteDialogVisible}
        setIsDialogVisible={setIsDeleteDialogVisible}
        onConfirm={deleteNoteHandler}
      />
      <ConfirmAlert
        message="Do you want to save changes before leaving?"
        isDialogVisible={isLeaveDialogVisible}
        setIsDialogVisible={setIsLeaveDialogVisible}
        onDeny={() =>
          leaveNavigationAction && navigation.dispatch(leaveNavigationAction)
        }
        onConfirm={async () => {
          await saveNoteHandler(undefined, false);

          leaveNavigationAction && navigation.dispatch(leaveNavigationAction);
        }}
      />
    </Wrapper>
  );
};

const SScrollView = styled.ScrollView``;

const SLinearGradient = styled(LinearGradient)`
  flex: 1;
`;

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
  elevation: 16;
  ${({ isLocked }) => isLocked && `border: 1px solid ${theme.colors.cyan600};`}
`;

const FormContentContainer = styled.View``;

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: space-between;
  width: 100%;
  padding-vertical: 1px;
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

export default EditNoteScreen;

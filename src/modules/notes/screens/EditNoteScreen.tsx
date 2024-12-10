import { LinearGradient } from "expo-linear-gradient";
import isEqual from "lodash.isequal";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, ScrollView } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import Toast from "react-native-toast-message";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import ConfirmAlert from "components/ConfirmAlert";
import HeaderBar from "components/HeaderBar";
import LeaveConfirmAlert from "components/LeaveConfirmAlert";
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
import FormActionButtons from "../components/noteForm/FormActionButtons";
import ImagePicker from "../components/noteForm/ImagePicker";
import ImagesSection from "../components/noteForm/ImagesSection";
import ImportanceInput from "../components/noteForm/ImportanceInput";
import LockButton from "../components/noteForm/LockButton";
import NeighboringNotesLinks from "../components/noteForm/NeighboringNotesLinks";
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

// TODO: refactor
const EditNoteScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_NOTE>;
}> = ({ route }) => {
  const [updateNote] = notesApi.useUpdateNoteMutation();
  const [createNote] = notesApi.useCreateNoteMutation();
  const [deleteNote] = notesApi.useDeleteNoteMutation();

  const { t } = useTranslation();
  const navigation = useAppNavigation();

  const userId = useAppSelector(getUserId) ?? "";
  const allLabels = useAppSelector(getLabels);

  const { item: initialNote, isNewNote, date } = route.params;

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

  const shouldDisplayNeighboringNotes = !!_id;

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
  const [currentStartDate, setCurrentStartDate] = useState(
    isNewNote && date ? date : startDate,
  );
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

  const currentNote: Note = useMemo(
    () => ({
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
    }),
    [
      cleanedHtml,
      currentCategories,
      currentColor,
      currentImages,
      currentImportance,
      currentStartDate,
      currentTitle,
      currentType,
      initialNote,
      isLocked,
      isStarred,
      userId,
    ],
  );

  const [savedNote, setSavedNote] = useState(currentNote);

  const hasChanges = !isEqual(savedNote, currentNote);

  const hasChangesIfIgnoreLocked = !isEqual(
    { ...savedNote, isLocked: false },
    { ...currentNote, isLocked: false },
  );

  const handleImages = useHandleImagesOnSave();

  const saveNoteHandler = useCallback(
    async (shouldLock?: boolean, withAlert = true) => {
      if (!userId) return;

      setIsSaving(true);

      logUserEvent(
        isNewNote ? CustomUserEvents.CREATE_NOTE : CustomUserEvents.SAVE_NOTE,
        currentNote._id ? { noteId: currentNote._id } : undefined,
      );
      addCrashlyticsLog(
        `User tries to ${isNewNote ? "create" : "update"} a note`,
      );

      const { newImages, uploadedNewImages } = await handleImages(
        currentImages,
        savedNote,
      );

      setCurrentImages(newImages);

      const newNote = {
        ...currentNote,
        isLocked: shouldLock ?? currentNote.isLocked,
        images: newImages,
      };

      setSavedNote(newNote);

      const updateNoteData: UpdateNoteRequest = {
        ...currentNote,
        title: currentNote.title || t("note.Note"),
        type: currentTypeId,
        category: currentCategoriesIds,
        isLocked: shouldLock ?? currentNote.isLocked,
        images: newImages.map((image) => image._id),
      };

      try {
        if (isNewNote) {
          const response = await createNote(updateNoteData).unwrap();

          if (response.note) {
            const newNoteId = response.note._id;

            navigation.replace(Routes.EDIT_NOTE, {
              item: { ...newNote, _id: newNoteId },
            });
          }
        } else {
          await updateNote(updateNoteData);

          if (uploadedNewImages) {
            navigation.replace(Routes.EDIT_NOTE, {
              item: newNote,
            });
          }
        }

        if (withAlert) {
          Toast.show({
            type: "success",
            text1: t("general.success"),
            text2: t(isNewNote ? "note.createdInfo" : "note.updatedInfo"),
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
    },
    [
      createNote,
      currentCategoriesIds,
      currentImages,
      currentNote,
      currentTypeId,
      handleImages,
      isNewNote,
      navigation,
      savedNote,
      t,
      updateNote,
      userId,
    ],
  );

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
        text1: t("general.success"),
        text2: t("note.deletedInfo"),
      });

      navigation.pop();
    } catch (error) {
      logging.error(error);
      alertError();
    } finally {
      setIsDeleting(false);
    }
  }, [_id, currentImages, deleteNote, navigation, t]);

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

  // TODO: implement full screen gradient
  // const gradientColors = [
  //   getDifferentColor(currentColor, -15),
  //   getDifferentColor(currentColor, 10),
  //   getDifferentColor(currentColor, -15),
  // ] as const;

  return (
    <Wrapper onStartShouldSetResponder={onStartShouldSetResponder}>
      <HeaderBar
        title={isNewNote ? t("note.createNote") : t("note.editNote")}
        withAddBtn={!isNewNote}
        withBackArrow
        bgColor={currentColor}
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
                withAutoFocus={!!isNewNote}
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
              <FormActionButtons
                isSaving={isSaving}
                disabled={!hasChanges || currentTitle.trim() === ""}
                isDeleting={isDeleting}
                isNewItem={!!isNewNote}
                isLocked={isLocked}
                saveItem={saveNoteHandler}
                deleteItem={() => setIsDeleteDialogVisible(true)}
              />
            </FormContentContainer>
            <ImagesSection
              currentImages={currentImages}
              isLocked={isLocked}
              setCurrentImages={setCurrentImages}
            />
            {shouldDisplayNeighboringNotes && (
              <NeighboringNotesLinks noteId={currentNote._id} />
            )}
          </Container>
          <Typography fontSize="lg" paddingBottom={8}>
            {t("note.preview")}
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
        message={t("note.deleteConfirmation")}
        isDeletion
        isDialogVisible={isDeleteDialogVisible}
        setIsDialogVisible={setIsDeleteDialogVisible}
        onConfirm={deleteNoteHandler}
      />
      <LeaveConfirmAlert
        hasChanges={hasChanges}
        onConfirm={async () => {
          await saveNoteHandler(undefined, false);
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

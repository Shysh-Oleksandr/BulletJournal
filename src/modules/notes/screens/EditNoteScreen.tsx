import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Alert, GestureResponderEvent } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import logging from "config/logging";
import { getUserId } from "modules/auth/AuthSlice";
import { useAppNavigation } from "modules/navigation/NavigationService";
import { RootStackParamList, Routes } from "modules/navigation/types";
import { useAppSelector } from "store/helpers/storeHooks";
import styled from "styled-components/native";
import { getContentWords } from "utils/getContentWords";
import { getPluralLabel } from "utils/getPluralLabel";

import ColorPicker from "../components/ColorPicker";
import DatePicker from "../components/DatePicker";
import ImportanceInput from "../components/ImportanceInput";
import NoteActionButtons from "../components/NoteActionButtons";
import NoteBody from "../components/NoteBody";
import TextEditor from "../components/TextEditor";
import TitleInput from "../components/TitleInput";
import { notesApi } from "../NotesApi";
import { Note } from "../types";
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

  const { item: initialNote, isNewNote } = route.params;

  const { _id, title, content, color, rating, startDate } = initialNote;

  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentStartDate, setCurrentStartDate] = useState(startDate);
  const [currentImportance, setCurrentImportance] = useState(rating);
  const [currentColor, setCurrentColor] = useState(color);
  // const [currentType, setCurrentType] = useState(type?.labelName ?? "Note");
  const [contentHTML, setContentHTML] = useState(content);

  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [isChildrenIdsSet, setIsChildrenIdsSet] = useState(false);

  // const [isTypeSelectorExpanded, setIsTypeSelectorExpanded] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const richTextRef = useRef<RichEditor | null>(null);

  const wordsCount = useMemo(
    () => getContentWords(removeMarkdown(contentHTML)),
    [contentHTML],
  );

  const saveNoteHandler = useCallback(async () => {
    if (!userId) {
      logging.error("The user doesn't have an id");

      return;
    }

    if (currentTitle.trim() === "") {
      Alert.alert("Error", "Please fill out all the required fields");

      return;
    }

    setIsSaving(true);

    const note: Note = {
      ...initialNote,
      author: userId,
      title: currentTitle.trim(),
      content: contentHTML.trim(),
      color: currentColor,
      startDate: currentStartDate,
      rating: currentImportance,
      category: [],
    };

    try {
      if (isNewNote) {
        await createNote(note);

        navigation.replace(Routes.EDIT_NOTE, { item: note });
      } else {
        await updateNote(note);
      }
      Alert.alert(
        "Success",
        `The note is ${isNewNote ? "created" : "updated"}`,
      );
    } catch (error) {
      logging.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [
    userId,
    currentTitle,
    currentStartDate,
    initialNote,
    contentHTML,
    currentColor,
    currentImportance,
    isNewNote,
    createNote,
    navigation,
    updateNote,
  ]);

  const deleteNoteHandler = useCallback(async () => {
    if (!_id) return;

    try {
      setIsDeleting(true);
      await deleteNote(_id);
      Alert.alert("Success", "The note is deleted");
      navigation.navigate(Routes.NOTES);
    } catch (error) {
      logging.error(error);
    } finally {
      setIsDeleting(false);
    }
  }, [_id, deleteNote, navigation]);

  return (
    <Wrapper
      onStartShouldSetResponder={(evt: GestureResponderEvent) => {
        evt.persist();
        if (childrenIds?.length) {
          if (childrenIds.includes(+evt.nativeEvent.target)) {
            return false;
          }

          richTextRef.current?.dismissKeyboard();

          return false;
        }

        return false;
      }}
    >
      <HeaderBar
        withBackArrow
        title={`${isNewNote ? "Create" : "Edit"} note`}
      />
      <SScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={contentContainerStyle}
      >
        <StyledDropShadow distance={10} offset={[0, 5]} startColor="#00000010">
          <Container>
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
                <Typography
                  fontWeight="medium"
                  fontSize="lg"
                  color={theme.colors.darkBlueText}
                >
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
            {/* <TypeSelector
              currentType={currentType}
              isExpanded={isTypeSelectorExpanded}
              setIsExpanded={setIsTypeSelectorExpanded}
              setCurrentType={setCurrentType}
            /> */}
            <TextEditor
              initialContentHtml={content}
              richTextRef={richTextRef}
              isPressable // ={!isTypeSelectorExpanded}
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
              isDeleting={isDeleting}
              isNewNote={!!isNewNote}
              saveNote={saveNoteHandler}
              deleteNote={deleteNoteHandler}
            />
          </Container>
        </StyledDropShadow>
        <Typography
          fontWeight="medium"
          fontSize="lg"
          paddingBottom={8}
          color={theme.colors.darkBlueText}
        >
          Preview
        </Typography>
        <NoteBody
          {...route.params.item}
          title={currentTitle}
          rating={currentImportance}
          color={currentColor}
          // type={{ ...type, labelName: currentType } as Category}
          content={contentHTML}
        />
      </SScrollView>
    </Wrapper>
  );
};

const SScrollView = styled.ScrollView``;

const Wrapper = styled.View`
  flex: 1;
`;

const Container = styled.View`
  padding: 10px 20px 30px;
  align-center: center;
  margin: 25px 0 20px;
  background-color: ${theme.colors.white};
  border-radius: 6px;
`;

const StyledDropShadow = styled(Shadow)`
  width: 100%;
`;

const Section = styled.View`
  flex-direction: row;
  align-center: center;
  justify-content: space-between;
  width: 100%;
  padding-vertical: 4px;
  border-bottom-width: 2px;
  border-color: ${theme.colors.cyan200};
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

import React, { FC, useMemo, useRef, useState } from "react";
import { GestureResponderEvent } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { Shadow } from "react-native-shadow-2";
import theme from "theme";

import { RouteProp } from "@react-navigation/native";
import HeaderBar from "components/HeaderBar";
import Typography from "components/Typography";
import { RootStackParamList, Routes } from "modules/navigation/types";
import styled from "styled-components/native";
import { getContentWords } from "utils/getContentWords";

import ColorPicker from "../components/ColorPicker";
import DatePicker from "../components/DatePicker";
import ImportanceInput from "../components/ImportanceInput";
import NoteActionButtons from "../components/NoteActionButtons";
import NoteBody from "../components/NoteBody";
import TextEditor from "../components/TextEditor";
import TitleInput from "../components/TitleInput";
import TypeSelector from "../components/TypeSelector";
import { Category } from "../types";
import getAllChildrenIds from "../util/getAllChildrenIds";

const EditNoteScreen: FC<{
  route: RouteProp<RootStackParamList, Routes.EDIT_NOTE>;
}> = ({ route }) => {
  const { title, content, color, type, rating, startDate } = route.params.item;

  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentStartDate, setCurrentStartDate] = useState(startDate);
  const [currentImportance, setCurrentImportance] = useState(rating);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentType, setCurrentType] = useState(type?.labelName ?? "Note");
  const [contentHTML, setContentHTML] = useState(content);

  const [childrenIds, setChildrenIds] = useState<number[]>([]);
  const [isChildrenIdsSet, setIsChildrenIdsSet] = useState(false);

  const [isTypeSelectorExpanded, setIsTypeSelectorExpanded] = useState(false);

  const richTextRef = useRef<RichEditor | null>(null);

  const wordsCount = useMemo(() => getContentWords(contentHTML), [contentHTML]);

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
      <HeaderBar withBackArrow title="Edit note" />
      <SScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 50,
        }}
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
                  {wordsCount} words
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
              currentType={currentType}
              isExpanded={isTypeSelectorExpanded}
              setIsExpanded={setIsTypeSelectorExpanded}
              setCurrentType={setCurrentType}
            />
            <TextEditor
              initialContentHtml={content}
              richTextRef={richTextRef}
              isPressable={!isTypeSelectorExpanded}
              containerRef={(component) => {
                if (component && !isChildrenIdsSet) {
                  setChildrenIds(getAllChildrenIds(component));
                  setIsChildrenIdsSet(true);
                }
              }}
              setContentHTML={setContentHTML}
            />
            <NoteActionButtons />
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
          type={{ ...type, labelName: currentType } as Category}
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

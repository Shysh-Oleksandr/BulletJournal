import debounce from "lodash.debounce";
import React, { useCallback, useMemo } from "react";
import { ScrollView, Dimensions } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import theme from "theme";

import styled from "styled-components/native";

import FontFamilyStylesheet from "../../styles/stylesheet";

const { height: screenHeight } = Dimensions.get("window");

const isBigScreen = screenHeight > 800;

const scrollExtraOffsetY = Math.round(screenHeight * (isBigScreen ? 0.2 : 0.3));

const fontFamily = "Montserrat";
const editorStyle = {
  caretColor: theme.colors.cyan600,
  color: theme.colors.editorText,
  initialCSSText: `${FontFamilyStylesheet}`,
  contentCSSText: `font-family: ${fontFamily}`,
};

type Props = {
  initialContentHtml: string;
  richTextRef: React.MutableRefObject<RichEditor | null>;
  containerRef: React.Ref<ScrollView>;
  scrollViewRef: React.MutableRefObject<ScrollView | null>;
  setContentHTML: React.Dispatch<React.SetStateAction<string>>;
};

const TextEditor = ({
  initialContentHtml,
  richTextRef,
  containerRef,
  scrollViewRef,
  setContentHTML,
}: Props): JSX.Element => {
  const richTextHandle = useCallback(
    (text: string) => {
      setContentHTML(text);
    },
    [setContentHTML],
  );

  const onCursorPosition = useCallback(
    (offsetY: number) => {
      scrollViewRef.current?.scrollTo({
        y: offsetY + scrollExtraOffsetY,
        animated: true,
      });
    },
    [scrollViewRef],
  );

  const richTextHandleDebouncer = useMemo(
    () => debounce(richTextHandle, 500),
    [richTextHandle],
  );

  return (
    <Section ref={containerRef} showsVerticalScrollIndicator={false}>
      <RichToolbar
        editor={richTextRef}
        style={{
          backgroundColor: theme.colors.cyan300,
          borderBottomWidth: 2,
          borderColor: theme.colors.cyan200,
        }}
        selectedIconTint={theme.colors.black}
        iconTint={theme.colors.darkBlueText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.line,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.removeFormat,
          // actions.checkboxList, // is not supported yet
          // actions.insertOrderedList,
          actions.blockquote,
          actions.undo,
          actions.redo,
        ]}
      />
      <RichEditor
        ref={richTextRef}
        onChange={richTextHandleDebouncer}
        placeholder="Write your note here..."
        initialContentHTML={initialContentHtml}
        initialHeight={250}
        onCursorPosition={onCursorPosition}
        autoCapitalize="sentences"
        editorStyle={editorStyle}
        showsVerticalScrollIndicator={false}
      />
    </Section>
  );
};

const Section = styled.ScrollView`
  z-index: 1000;
  width: 100%;
  margin-top: 20px;
`;

export default React.memo(TextEditor);

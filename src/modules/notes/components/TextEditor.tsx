import debounce from "lodash.debounce";
import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import theme from "theme";

import styled from "styled-components/native";

type Props = {
  initialContentHtml: string;
  richTextRef: React.MutableRefObject<RichEditor | null>;
  containerRef: React.Ref<ScrollView>;
  isPressable: boolean;
  setContentHTML: React.Dispatch<React.SetStateAction<string>>;
};

const TextEditor = ({
  initialContentHtml,
  richTextRef,
  containerRef,
  isPressable,
  setContentHTML,
}: Props): JSX.Element => {
  const richTextHandle = useCallback(
    (text: string) => {
      setContentHTML(text);
    },
    [setContentHTML],
  );

  const richTextHandleDebouncer = useMemo(
    () => debounce(richTextHandle, 300),
    [richTextHandle],
  );

  return (
    <Section ref={containerRef} pointerEvents={isPressable ? "auto" : "none"}>
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
          actions.insertOrderedList,
          // actions.insertBulletsList,
          // actions.checkboxList, // is not supported yet
          actions.insertLink,
          actions.blockquote,
          actions.undo,
        ]}
      />
      <RichEditor
        ref={richTextRef}
        onChange={richTextHandleDebouncer}
        placeholder="Write your note here..."
        initialContentHTML={initialContentHtml}
        initialHeight={250}
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

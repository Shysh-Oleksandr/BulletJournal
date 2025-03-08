import React from "react";
import { useSharedValue } from "react-native-reanimated";

import styled from "styled-components/native";

import AccordionContent from "./AccordionContent";

export type AccordionProps = {
  headerContent: React.ReactNode;
  content: React.ReactNode;
  isExpanded?: boolean;
  viewKey: string;
  setIsOpen: (value: boolean) => void;
};

const Accordion = ({
  headerContent,
  content,
  isExpanded,
  viewKey,
  setIsOpen,
}: AccordionProps) => {
  const open = useSharedValue(false);

  const onHeaderPress = () => {
    setIsOpen(!open.value);

    open.value = !open.value;
  };

  return (
    <Container>
      <AccordionHeader onPress={onHeaderPress}>{headerContent}</AccordionHeader>
      <AccordionContent isExpanded={open} viewKey={viewKey}>
        {isExpanded && content}
      </AccordionContent>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
`;

const AccordionHeader = styled.TouchableOpacity`
  width: 100%;
`;

export default Accordion;

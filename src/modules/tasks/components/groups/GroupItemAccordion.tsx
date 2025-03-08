import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import theme from "theme";

import Accordion, { AccordionProps } from "components/Accordion";
import AccordionArrowIcon from "components/Accordion/AccordionArrowIcon";
import ProgressBar from "components/ProgressBar";
import styled from "styled-components/native";

const gradientColors = [theme.colors.white, theme.colors.cyan300] as const;

type Props = Pick<AccordionProps, "headerContent" | "content" | "viewKey"> & {
  percentageCompleted?: number;
  accentColor?: string;
};

const GroupItemAccordion = ({
  headerContent,
  content,
  viewKey,
  percentageCompleted,
  accentColor,
}: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Container>
      <BgContainer colors={gradientColors}>
        <Accordion
          isExpanded={isExpanded}
          headerContent={
            <HeaderContainer>
              {headerContent}
              <AccordionArrowIcon isOpen={isExpanded} color={accentColor} />
            </HeaderContainer>
          }
          content={
            <>
              <ProgressBar
                bgColor={accentColor ?? theme.colors.cyan400}
                percentageCompleted={percentageCompleted || 0}
                style={{ height: 3 }}
              />
              <ContentContainer>{content}</ContentContainer>
            </>
          }
          viewKey={viewKey}
          setIsOpen={setIsExpanded}
        />
      </BgContainer>
    </Container>
  );
};

const Container = styled.View`
  border-radius: 8px;
  border: 1px solid ${theme.colors.cyan400};
`;

const ContentContainer = styled.View`
  width: 100%;
  padding: 10px 8px 6px;
`;

const HeaderContainer = styled.View`
  width: 100%;
  padding: 0 10px 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BgContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 8px;
  padding-top: 8px;
`;

export default React.memo(GroupItemAccordion);

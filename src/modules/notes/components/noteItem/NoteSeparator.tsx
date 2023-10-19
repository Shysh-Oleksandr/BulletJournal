import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";

import { Note } from "../../types";

type Props = {
  leadingItem?: Note;
  trailingItem?: Note;
  isFirstItem?: boolean;
};

const NoteSeparator = ({
  leadingItem,
  trailingItem,
  isFirstItem,
}: Props): JSX.Element | null => {
  if (!leadingItem || !trailingItem) return null;

  const date = new Date(trailingItem.startDate).toDateString();

  const isTheSameDate = new Date(leadingItem.startDate).toDateString() === date;

  if (isTheSameDate && !isFirstItem) return <VerticalLine />;

  return (
    <DateContainer>
      {!isFirstItem && <VerticalLine />}
      <Typography
        fontWeight="medium"
        fontSize="lg"
        paddingBottom={2}
        color={theme.colors.darkBlueText}
      >
        {date}
      </Typography>
      <VerticalLine />
    </DateContainer>
  );
};

const DateContainer = styled.View`
  width: 100%;
`;

const VerticalLine = styled.View`
  width: 4px;
  height: 24px;
  background-color: ${theme.colors.gray};
  border-radius: 15px;
  margin-left: 30px;
`;

export default React.memo(NoteSeparator);

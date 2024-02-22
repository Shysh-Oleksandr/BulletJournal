import { format } from "date-fns";
import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import { NOTE_DATE_FORMAT } from "modules/notes/data";
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

  const date = format(new Date(trailingItem.startDate), NOTE_DATE_FORMAT);

  const isTheSameDate =
    format(new Date(leadingItem.startDate), NOTE_DATE_FORMAT) === date;

  if (isTheSameDate && !isFirstItem) return <VerticalLine />;

  return (
    <DateContainer>
      {!isFirstItem && <VerticalLine />}
      <Typography fontSize="lg" paddingBottom={2}>
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

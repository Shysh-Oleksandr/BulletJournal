import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";
import { getDifferentColor } from "utils/getDifferentColor";

type Props = {
  label: string | JSX.Element;
  color: string;
  isLast?: boolean;
};

const NoteLabel = ({ label, color, isLast }: Props): JSX.Element => {
  const labelBgColor = getDifferentColor(color, 12);
  const textColor = getDifferentColor(color, 100);

  return (
    <LabelItemContainer bgColor={labelBgColor} isLast={isLast}>
      <Typography color={textColor}>{label}</Typography>
    </LabelItemContainer>
  );
};

const LabelItemContainer = styled.View<{ bgColor?: string; isLast?: boolean }>`
  background-color: ${({ bgColor }) => bgColor ?? theme.colors.cyan500};
  border-radius: 6px;
  padding: 4px 8px;
  ${({ isLast }) => !isLast && "margin-right: 8px;"}
  margin-top: 8px;
`;

export default NoteLabel;

import React from "react";
import theme from "theme";

import Typography from "components/Typography";
import { CustomLabel } from "modules/customLabels/types";
import styled from "styled-components/native";

type Props = {
  labels?: CustomLabel[];
};

const CustomLabelsLabel = ({ labels }: Props): JSX.Element | null => {
  if (!labels || labels.length === 0) return null;

  return (
    <>
      {labels.map((label) => (
        <LabelContainer key={label._id} bgColor={label.color}>
          <Typography fontSize="xs" lineHeight={15} color={theme.colors.white}>
            {label.labelName}
          </Typography>
        </LabelContainer>
      ))}
    </>
  );
};

const LabelContainer = styled.View<{ bgColor: string }>`
  padding: 1px 4px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 4px;
`;

export default React.memo(CustomLabelsLabel);

import React from "react";

import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  label: string;
  bottomOffset?: number;
};

const FormLabel = ({ label, bottomOffset = -18 }: Props): JSX.Element => (
  <FormLabelContainer bottomOffset={bottomOffset}>
    <Typography fontSize="xxs">{label}</Typography>
  </FormLabelContainer>
);

const FormLabelContainer = styled.View<{ bottomOffset: number }>`
  position: absolute;
  bottom: ${({ bottomOffset }) => bottomOffset}px;
`;

export default React.memo(FormLabel);

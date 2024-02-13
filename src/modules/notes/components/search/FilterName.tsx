import React from "react";
import { StyleSheet } from "react-native";
import theme from "theme";

import Typography from "components/Typography";
import styled from "styled-components/native";

type Props = {
  label: string;
  marginTop?: number;
};

const FilterName = ({ label, marginTop = 16 }: Props): JSX.Element => (
  <FilterNameContainer marginTop={marginTop}>
    <HorizontalLine />
    <FilterNameInnerContainer>
      <Typography fontSize="sm" color={theme.colors.darkBlueText}>
        {label}
      </Typography>
    </FilterNameInnerContainer>
  </FilterNameContainer>
);

const FilterNameContainer = styled.View<{ marginTop: number }>`
  align-items: center;
  justify-content: center;
  margin-bottom: -4px;
  margin-top: ${({ marginTop }) => marginTop}px;
`;

const HorizontalLine = styled.View`
  width: 100%;
  height: ${StyleSheet.hairlineWidth * 3}px;
  background-color: ${theme.colors.cyan600};
`;

const FilterNameInnerContainer = styled.View`
  top: -12px;
  padding-horizontal: 8px;
  background-color: ${theme.colors.cyan300};
  border-radius: 20px;
`;

export default FilterName;

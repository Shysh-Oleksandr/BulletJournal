import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import styled from "styled-components/native";

type Props = {
  isActive: boolean;
};

const Checkbox = ({ isActive }: Props): JSX.Element => (
  <CheckboxContainer isActive={isActive}>
    {isActive && (
      <FontAwesome
        name="check"
        color={theme.colors.white}
        size={theme.fontSizes.sm}
      />
    )}
  </CheckboxContainer>
);
const CheckboxContainer = styled.View<{ isActive: boolean }>`
  padding: 2px;
  width: 24px;
  height: 24px;
  background-color: ${({ isActive }) =>
    isActive ? theme.colors.cyan500 : theme.colors.gray};
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;

export default Checkbox;

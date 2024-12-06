import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import styled from "styled-components/native";

type Props = {
  isActive: boolean;
  size?: number;
  bgColor?: string;
  iconColor?: string;
  borderRadius?: number;
  iconSize?: number;
};

const Checkbox = ({
  isActive,
  size = 24,
  borderRadius = 6,
  iconColor = theme.colors.white,
  iconSize = theme.fontSizes.sm,
  bgColor,
}: Props): JSX.Element => (
  <CheckboxContainer
    isActive={isActive}
    size={size}
    bgColor={bgColor}
    borderRadius={borderRadius}
  >
    {isActive && <FontAwesome name="check" color={iconColor} size={iconSize} />}
  </CheckboxContainer>
);
const CheckboxContainer = styled.View<{
  isActive: boolean;
  size: number;
  borderRadius: number;
  bgColor?: string;
}>`
  padding: 2px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ isActive, bgColor }) =>
    bgColor ?? (isActive ? theme.colors.cyan500 : theme.colors.gray)};
  border-radius: ${({ borderRadius }) => borderRadius}px;
  align-items: center;
  justify-content: center;
`;

export default Checkbox;

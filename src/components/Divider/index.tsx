import React, { memo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import theme from "theme";

import styled from "styled-components/native";

import SvgDashedLine from "./components/SvgDashedLine";

interface Props extends ViewStyle {
  filledLineAndGapSize?: string;
  lineOpacity?: number;
  lineColor?: string;
  bgColor?: string;
  dashed?: boolean;
  height?: number;
}

const Divider = ({
  lineColor = theme.colors.gray,
  bgColor = "transparent",
  filledLineAndGapSize,
  lineOpacity = 1,
  width = "100%",
  height = StyleSheet.hairlineWidth * 3,
  dashed,
  ...props
}: Props): JSX.Element => (
  <View style={{ height, width, backgroundColor: bgColor, ...props }}>
    {dashed ? (
      <SvgDashedLine
        filledLineAndGapSize={filledLineAndGapSize}
        opacity={lineOpacity}
        lineColor={lineColor}
        height={height}
      />
    ) : (
      <Line lineColor={lineColor} opacity={lineOpacity} height={height} />
    )}
  </View>
);

const Line = styled.View<{
  lineColor: string;
  opacity: number;
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100%;

  background-color: ${({ lineColor }) => lineColor};
  opacity: ${({ opacity }) => opacity};
`;

export default memo(Divider);

import React, { memo } from "react";
import { Svg, Path } from "react-native-svg";

type Props = {
  filledLineAndGapSize?: string;
  lineColor: string;
  opacity: number;
  height: number;
};

const SvgDashedLine = ({
  filledLineAndGapSize = "4,4",
  lineColor,
  opacity,
  height,
}: Props): JSX.Element => {
  return (
    <Svg height={height} width="100%">
      <Path
        strokeDasharray={filledLineAndGapSize}
        d={`M0 ${height / 2} H1000`}
        strokeWidth={height}
        stroke={lineColor}
        opacity={opacity}
      />
    </Svg>
  );
};

export default memo(SvgDashedLine);

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import theme from "theme";

import styled from "styled-components/native";
import { getDifferentColor, isLightColor } from "utils/getDifferentColor";

type Props = {
  bgColor: string;
  percentageCompleted: number | null;
  style?: any;
};

const ANIMATION_DURATION = 600;

const ProgressBar = ({
  bgColor,
  percentageCompleted,
  style,
}: Props): JSX.Element => {
  const progress = useSharedValue(0);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(
    null,
  );

  useEffect(() => {
    if (containerWidth !== null && percentageCompleted !== null) {
      progress.value = withTiming(
        (percentageCompleted / 100) * containerWidth,
        {
          duration: ANIMATION_DURATION,
        },
      );
    }
  }, [percentageCompleted, containerWidth, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  const secondaryBgColor = useMemo(
    () =>
      isLightColor(bgColor)
        ? getDifferentColor(bgColor, 10)
        : getDifferentColor(bgColor, 35),
    [bgColor],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  return (
    <ProgressBarContainer onLayout={handleLayout} style={style}>
      {containerWidth !== null && (
        <Animated.View style={animatedStyle}>
          <LinearGradient
            start={[0, 1]}
            end={[1, 0]}
            colors={[secondaryBgColor, bgColor]}
            style={{ height: "100%" }}
          />
        </Animated.View>
      )}
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 6px;
  background-color: ${theme.colors.cyan300};
`;

export default React.memo(ProgressBar);

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";
import theme from "theme";

import styled from "styled-components/native";
import { getDifferentColor, isLightColor } from "utils/getDifferentColor";

const ANIMATION_DURATION = 600;

type Props = {
  bgColor: string;
  percentageCompleted: number;
};

const ProgressBar = ({ bgColor, percentageCompleted }: Props): JSX.Element => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentageCompleted,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, percentageCompleted]);

  const animatedWidthStyle = {
    width: animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  const secondaryBgColor = useMemo(
    () =>
      isLightColor(bgColor)
        ? getDifferentColor(bgColor, 20)
        : getDifferentColor(bgColor, 35),
    [bgColor],
  );

  return (
    <ProgressBarContainer>
      <AnimatedSProgressBar
        start={[0, 1]}
        end={[1, 0]}
        colors={[secondaryBgColor, bgColor]}
        style={animatedWidthStyle}
      />
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.View`
  width: 100%;
  height: 6px;
  background-color: ${theme.colors.cyan300};
`;

const AnimatedSProgressBar = styled(
  Animated.createAnimatedComponent(LinearGradient),
)`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`;

export default React.memo(ProgressBar);

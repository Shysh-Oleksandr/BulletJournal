import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import styled from "styled-components/native";

const ANIMATION_DURATION = 300;

type Props = {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
};

const AccordionContent = ({ isExpanded, children, viewKey }: Props) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration: ANIMATION_DURATION,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <AnimatedContainer key={`accordionItem_${viewKey}`} style={bodyStyle}>
      <Container
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
      >
        {children}
      </Container>
    </AnimatedContainer>
  );
};

const AnimatedContainer = styled(Animated.View)`
  width: 100%;
  overflow: hidden;
`;
const Container = styled.View`
  align-items: center;
  width: 100%;
  position: absolute;
`;

export default AccordionContent;

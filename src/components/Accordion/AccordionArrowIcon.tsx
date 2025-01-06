import React from "react";
import theme from "theme";

import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

type Props = {
  isOpen: boolean;
};

const AccordionArrowIcon = ({ isOpen }: Props) => {
  // TODO: handle animation
  // Create a shared value for rotation
  // const rotation = useSharedValue(0);

  // // Update rotation based on isOpen
  // React.useEffect(() => {
  //   rotation.value = withTiming(isOpen ? 180 : 0, { duration: 500 });
  // }, [isOpen, rotation]);

  // // Animated style
  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ rotate: `${rotation.value}deg` }],
  // }));

  return (
    <IconContainer isOpen={isOpen}>
      <MaterialIcons
        name="keyboard-arrow-down"
        color={theme.colors.darkBlueText}
        size={28}
      />
    </IconContainer>
  );
};

const IconContainer = styled.View<{ isOpen: boolean }>`
  ${({ isOpen }) => isOpen && "transform: rotate(180deg);"}
`;

export default AccordionArrowIcon;

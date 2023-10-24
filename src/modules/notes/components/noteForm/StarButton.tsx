import React from "react";
import theme from "theme";

import { FontAwesome } from "@expo/vector-icons";
import { SMALL_BUTTON_HIT_SLOP } from "modules/app/constants";
import styled from "styled-components/native";

type Props = {
  isStarred: boolean;
  isDisabled: boolean;
  setIsStarred: React.Dispatch<React.SetStateAction<boolean>>;
};

const StarButton = ({
  isStarred,
  isDisabled,
  setIsStarred,
}: Props): JSX.Element => (
  <Section
    onPress={() => setIsStarred((prev) => !prev)}
    disabled={isDisabled}
    hitSlop={SMALL_BUTTON_HIT_SLOP}
  >
    <FontAwesome
      name="star"
      size={24}
      color={isStarred ? theme.colors.cyan500 : theme.colors.gray}
    />
  </Section>
);

const Section = styled.TouchableOpacity``;

export default StarButton;
